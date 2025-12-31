import React, { useContext, useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { AuthContext } from '../context/AuthContext';
import {
  getTodos,
  addTodo,
  markCompleted,
  deleteTodo,
  updateTodoTitle,
} from '../database/db';
import GradientBackground from '../components/GradientBackground';
import Modal from 'react-native-modal';
import Icon from 'react-native-vector-icons/Ionicons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import DatePicker from 'react-native-date-picker';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Entypo from 'react-native-vector-icons/Entypo';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';

const getPriorityStyle = priority => {
  switch (priority) {
    case 'High':
      return {
        color: '#ffff',
        backgroundColor: '#ec1313ff',
      };
    case 'Medium':
      return {
        color: '#fff7e6',
        backgroundColor: '#faad14',
      };
    case 'Low':
      return {
        color: '#edf7ed',
        backgroundColor: '#52c41a',
      };
    default:
      return {
        color: '#555',
        backgroundColor: 'transparent',
      };
  }
};

const TodoScreen = () => {
  // ✅ Hooks at top level
  const { user, logout } = useContext(AuthContext);
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editingTitle, setEditingTitle] = useState('');
  const [isModalVisible, setModalVisible] = useState(false);
  const [priority, setPriority] = useState('Medium');
  const [dueDate, setDueDate] = useState(new Date());
  const [openDatePicker, setOpenDatePicker] = useState(false);
  const [activeFilter, setActiveFilter] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  // null | 'current' | 'upcoming' | 'completed'

  const today = new Date().toISOString().split('T')[0];

  const currentTasks = todos.filter(
    t => t.completed === 0 && t.due_date === today,
  );

  const upcomingTasks = todos.filter(
    t => t.completed === 0 && t.due_date > today,
  );

  const completedTasks = todos.filter(t => t.completed === 1);

  const hasAnyTask = todos.length > 0;

  if (!user) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Loading...</Text>
      </View>
    );
  }

  // Load todos for current user
  const loadTodos = async () => {
    try {
      const data = await getTodos(user.id);
      setTodos(data);
    } catch (err) {
      console.log('Error loading todos', err);
    }
  };

  useEffect(() => {
    if (user?.id) loadTodos();
  }, [user]);

  useFocusEffect(
    useCallback(() => {
      loadTodos();
    }, [user?.id]),
  );

  const handleAddTodo = async () => {
  if (!newTodo.trim()) return;

  await addTodo(
    user.id,
    newTodo.trim(),
    priority,
    dueDate.toISOString().split('T')[0]
  );

  setModalVisible(false);
  setNewTodo('');
  setPriority('Medium');
  setDueDate(new Date());

  loadTodos();
};


  // Delete todo
  const handleDeleteTodo = async id => {
    setTodos(prev => prev.filter(t => t.id !== id));
    await deleteTodo(id);
  };

  // Start editing
  const startEditing = (id, title) => {
    setEditingId(id);
    setEditingTitle(title);
  };

  // Save edit
  const saveEdit = async () => {
    if (!editingTitle.trim()) return;
    await updateTodoTitle(editingId, editingTitle.trim());
    setEditingId(null);
    setEditingTitle('');
    loadTodos();
  };

  // Cancel edit
  const cancelEdit = () => {
    setEditingId(null);
    setEditingTitle('');
  };

  // Render each todo item
  const renderItem = ({ item }) => {
    const isCompleted = item.completed === 1;
    const isCurrent = item.due_date === today && !isCompleted;
    const isUpcoming = item.due_date > today && !isCompleted;

    let itemStyle = styles.todoItem;

    if (isCurrent) itemStyle = [styles.todoItem, styles.currentItem];
    else if (isUpcoming) itemStyle = [styles.todoItem, styles.upcomingItem];
    else if (isCompleted) itemStyle = [styles.todoItem, styles.completedItem];

    return (
      <View style={itemStyle}>
        {editingId === item.id ? (
          /* ---------- EDIT MODE ---------- */
          <View style={{ flexDirection: 'row', flex: 1, alignItems: 'center' }}>
            <TextInput
              style={[styles.input, { flex: 1 }]}
              value={editingTitle}
              onChangeText={setEditingTitle}
            />
            <Button title="Save" onPress={saveEdit} />
            <Button title="Cancel" onPress={cancelEdit} />
          </View>
        ) : (
          /* ---------- VIEW MODE ---------- */
          <>
            <View style={{ flex: 1, flexDirection: 'row' }}>
              <FontAwesome
                name="circle"
                color="#0584b6ff"
                size={18}
                style={{ marginTop: 10, marginLeft: 10 }}
              />

              <View style={{ marginHorizontal: 10 }}>
                <Text
                  style={[styles.todoText, isCompleted && styles.completed]}
                >
                  {item.title}
                </Text>
                <Text
                  style={[styles.priority, getPriorityStyle(item.priority)]}
                >
                  {item.priority}
                </Text>
              </View>
            </View>

            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              {!isCompleted && (
                <TouchableOpacity
                  onPress={async () => {
                    await markCompleted(item.id);
                    loadTodos();
                  }}
                  style={styles.completeBtn}
                >
                  <Entypo name="check" color="#52c41a" size={24} />
                </TouchableOpacity>
              )}

              {!isCompleted && (
                <TouchableOpacity
                  onPress={() => startEditing(item.id, item.title)}
                  style={styles.iconBtn}
                >
                  <FontAwesome name="edit" size={22} color="#0b5ed7" />
                </TouchableOpacity>
              )}

              <TouchableOpacity
                onPress={() => handleDeleteTodo(item.id)}
                style={styles.iconBtn}
              >
                <Icon name="trash-outline" size={22} color="#dc3545" />
              </TouchableOpacity>
            </View>
          </>
        )}
      </View>
    );
  };

  return (
    <GradientBackground>
      <View style={styles.container}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text style={styles.title}>My Tasks</Text>

          <View
            style={{
              flex: 0.6,
              flexDirection: 'row',
              alignItems: 'flex-start',
            }}
          >
            {/* FILTER ICON */}
            <TouchableOpacity
              onPress={() => setShowFilters(p => !p)}
              style={{ marginTop: 20 }}
            >
              <Ionicons
                name="filter"
                size={30}
                color={activeFilter ? '#ffd700' : '#fff'}
              />
            </TouchableOpacity>

            {/* ADD BUTTON */}
            <TouchableOpacity
              style={styles.fab}
              onPress={() => setModalVisible(true)}
            >
              <Icon name="add" size={40} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>

        {showFilters && (
          <View style={styles.filterRow}>
            <TouchableOpacity
              onPress={() => setActiveFilter('current')}
              style={[
                styles.filterChip,
                activeFilter === 'current' && styles.filterChipActive,
              ]}
            >
              <Text
                style={{
                  color: activeFilter === 'current' ? '#fff' : '#000',
                  fontWeight: 'bold',
                }}
              >
                Current
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setActiveFilter('upcoming')}
              style={[
                styles.filterChip,
                activeFilter === 'upcoming' && styles.filterChipActive,
              ]}
            >
              <Text
                style={{
                  color: activeFilter === 'upcoming' ? '#fff' : '#000',
                  fontWeight: 'bold',
                }}
              >
                Upcoming
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setActiveFilter('completed')}
              style={[
                styles.filterChip,
                activeFilter === 'completed' && styles.filterChipActive,
              ]}
            >
              <Text
                style={{
                  color: activeFilter === 'completed' ? '#fff' : '#000',
                  fontWeight: 'bold',
                }}
              >
                Completed
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {activeFilter && (
          <TouchableOpacity
            onPress={() => setActiveFilter(null)}
            style={{
              backgroundColor: '#ffffffcc',
              paddingHorizontal: 12,
              paddingVertical: 6,
              borderRadius: 20,
              alignSelf: 'flex-start',
              marginBottom: 10,
            }}
          >
            <Text style={{ fontWeight: 'bold' }}>Clear Filter ✕</Text>
          </TouchableOpacity>
        )}

        {!hasAnyTask && (
          <View style={styles.emptyState}>
            <Ionicons name="clipboard-outline" color="#000" size={30} />
            <Text style={styles.emptyTitle}>No tasks yet</Text>
            <Text style={styles.emptySubtitle}>
              Tap the + button to create your first task
            </Text>
          </View>
        )}

        {/* {currentTasks.length > 0 && (
            <>
            <View style={styles.sectionBlock}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Entypo name="circle" color="#000" size={20} style={{ marginTop: 4,}} />
              <Text style={styles.sectionTitle}>Current Tasks</Text>
              </View>
              <FlatList
                data={currentTasks}
                extraData={todos}
                keyExtractor={item => item.id.toString()}
                renderItem={renderItem}
                scrollEnabled={false}
              />
              </View>
            </>
          )} */}

        {(activeFilter === null || activeFilter === 'current') &&
          currentTasks.length > 0 && (
            <View style={styles.sectionBlock}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Entypo
                  name="circle"
                  color="#000"
                  size={20}
                  style={{ marginTop: 4 }}
                />
                <Text style={styles.sectionTitle}>Current Tasks</Text>
              </View>
              <FlatList
                data={currentTasks}
                extraData={todos}
                keyExtractor={item => item.id.toString()}
                renderItem={renderItem}
                scrollEnabled={false}
              />
            </View>
          )}

        {/* {upcomingTasks.length > 0 && (
            <>
            <View style={styles.sectionBlock}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
               <MaterialCommunityIcons name="clock" color="#ff8c00" size={24} />
              <Text style={styles.sectionTitle}>Upcoming Tasks</Text>
              </View>
              <FlatList
                data={upcomingTasks}
                keyExtractor={item => item.id.toString()}
                renderItem={renderItem}
                scrollEnabled={false}
              />
              </View>
            </>
          )} */}

        {(activeFilter === null || activeFilter === 'upcoming') &&
          upcomingTasks.length > 0 && (
            <View style={styles.sectionBlock}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <MaterialCommunityIcons
                  name="clock"
                  color="#ff8c00"
                  size={24}
                />
                <Text style={styles.sectionTitle}>Upcoming Tasks</Text>
              </View>
              <FlatList
                data={upcomingTasks}
                keyExtractor={item => item.id.toString()}
                renderItem={renderItem}
                scrollEnabled={false}
              />
            </View>
          )}

        {/* {completedTasks.length > 0 && (
            <>
            <View style={styles.sectionBlock}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
               <Ionicons name="checkmark-circle-sharp" color="#2e8b57" size={28} />
              <Text style={styles.sectionTitle}>Completed Tasks</Text>
              </View>
              <FlatList
                data={completedTasks}
                keyExtractor={item => item.id.toString()}
                renderItem={renderItem}
                scrollEnabled={false}
              />
              </View>
            </>
          )} */}

        {(activeFilter === null || activeFilter === 'completed') &&
          completedTasks.length > 0 && (
            <View style={styles.sectionBlock}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Ionicons
                  name="checkmark-circle-sharp"
                  color="#2e8b57"
                  size={28}
                />
                <Text style={styles.sectionTitle}>Completed Tasks</Text>
              </View>
              <FlatList
                data={completedTasks}
                keyExtractor={item => item.id.toString()}
                renderItem={renderItem}
                scrollEnabled={false}
              />
            </View>
          )}

        <Modal isVisible={isModalVisible}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Add Task</Text>

            <TextInput
              placeholder="Task title"
              value={newTodo}
              onChangeText={setNewTodo}
              style={styles.input}
            />

            {/* Priority */}
            <View style={styles.priorityRow}>
              {['High', 'Medium', 'Low'].map(p => (
                <TouchableOpacity
                  key={p}
                  style={[
                    styles.priorityBtn,
                    priority === p && styles.priorityActive,
                  ]}
                  onPress={() => setPriority(p)}
                >
                  <Text>{p}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Date Picker */}
            <TouchableOpacity
              onPress={() => setOpenDatePicker(true)}
              style={styles.dateBtn}
            >
              <Icon name="calendar-outline" size={20} />
              <Text style={{ marginLeft: 10 }}>{dueDate.toDateString()}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.addButton} onPress={handleAddTodo}>
              <Text style={styles.buttonText}>Add Task</Text>
            </TouchableOpacity>

            {/* <Button
          title="Add Task"
          style={{marginBottom: 10}}
          onPress={async () => {
            if (!newTodo.trim()) return;

            await addTodo(
              user.id,
              newTodo.trim(),
              priority,
              dueDate.toISOString().split('T')[0]
            );

            setModalVisible(false);
            setNewTodo('');
            setPriority('Medium');
            setDueDate(new Date());
            loadTodos();
          }}
        /> */}

            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </Modal>

        <DatePicker
          modal
          open={openDatePicker}
          date={dueDate}
          onConfirm={date => {
            setOpenDatePicker(false);
            setDueDate(date);
          }}
          onCancel={() => setOpenDatePicker(false)}
        />
      </View>
    </GradientBackground>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: 'transparent' },
  title: {
    fontSize: 30,
    fontFamily: 'Inter_18pt-Bold',
    marginTop: 10,
    marginBottom: 20,
    color: '#ffff',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#fff',
    marginRight: 10,
  },
  todoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    marginVertical: 6,
    elevation: 6,
  },
  currentItem: {
    borderLeftWidth: 6,
    borderLeftColor: '#19475cff',
    backgroundColor: '#b2dafaff',
    borderRadius: 20,
  },

  upcomingItem: {
    borderLeftWidth: 5,
    borderLeftColor: '#ff8c00', // orange
    backgroundColor: '#fcd4a5ff',
    borderRadius: 20,
  },

  completedItem: {
    borderLeftWidth: 5,
    borderLeftColor: '#2e8b57', // green
    backgroundColor: '#a8f8cbff',
    borderRadius: 20,
  },

  todoText: { fontSize: 20, fontFamily: 'Inter_18pt-Bold' },
  completed: { textDecorationLine: 'line-through', color: '#999' },
  fab: {
    position: 'absolute',
    right: 10,
    marginTop: 10,
    backgroundColor: '#0a5cadff',
    width: 50,
    height: 50,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
  modalContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  priority: {
    fontSize: 12,
    fontFamily: 'Inter_18pt-Bold',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    alignSelf: 'flex-start',
    overflow: 'hidden',
  },
  priorityRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  priorityBtn: {
    padding: 10,
    borderWidth: 1,
    borderRadius: 8,
    width: '30%',
    alignItems: 'center',
  },
  priorityActive: {
    backgroundColor: '#add8e6',
  },
  dateBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Inter_18pt-Bold',
    marginVertical: 8,
    marginLeft: 6,
  },
  sectionBlock: {
    marginBottom: 12,
    overflow: 'visible',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyTitle: {
    fontFamily: 'Inter_18pt-Bold',
    fontSize: 20,
  },
  emptySubtitle: {
    fontFamily: 'Inter_18pt-Medium',
    fontSize: 17,
  },
  iconBtn: {
    marginRight: 10,
    padding: 6,
    borderRadius: 20,
    backgroundColor: '#ffffffaa',
    elevation: 3,
  },
  completeBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#ffffffaa',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    marginRight: 6,
  },
  filterRow: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#fff',
    borderRadius: 20,
    marginRight: 8,
  },
  filterChipActive: {
    backgroundColor: '#d18521ff',
  },
  addButton: {
    backgroundColor: '#43a2faff',
    borderWidth: 1,
    borderColor: '#196bb8ff',
    padding: 10,
    marginBottom: 10,
    borderRadius: 8,
    alignItems: 'center',
    elevation: 6,
  },
  buttonText: {
    color: '#fff',
    fontFamily: 'Inter_18pt-Bold',
  },
  cancelButton: {
    borderWidth: 1,

    backgroundColor: 'red',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
});

export default TodoScreen;
