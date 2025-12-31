import React, {useContext, useState, useEffect} from 'react';
import { View, Text,TextInput, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import GradientBackground from '../components/GradientBackground'
import Icon from 'react-native-vector-icons/Ionicons';
import { getTodos } from '../database/db';
import TaskItem from '../components/TaskItem';
import { markCompleted, deleteTodo, updateTodoTitle } from '../database/db';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';
import Entypo from 'react-native-vector-icons/Entypo';



const DashboardScreen = () => {
    const { user, logout } = useContext(AuthContext);
    const [searchVisible, setSearchVisible] = useState(false);
    const [searchText, setSearchText] = useState('');



    const [todos, setTodos] = useState([]);

        useFocusEffect(
            useCallback(() => {
              if (user?.id) {
                loadTodos();
              }
            }, [user])
        );

        const loadTodos = async () => {
        const data = await getTodos(user.id);
        setTodos(data);
        };

        const filteredTodos = todos.filter(t =>
          t.title.toLowerCase().includes(searchText.toLowerCase())
        );


        const today = new Date().toISOString().split('T')[0];

        const allTasksCount = filteredTodos.length;

        const currentTasks = filteredTodos.filter(
        t => t.completed === 0 && t.due_date === today
        );

        const upcomingTasks = filteredTodos.filter(
        t => t.completed === 0 && t.due_date > today
        );

        const completedTasks = filteredTodos.filter(
        t => t.completed === 1
        );


  return (

    <GradientBackground>
  <View style={styles.container}>

    {/* TOP BAR */}
    <View style={styles.topBar}>
      {/* LEFT */}
      <Text style={styles.text}>
        Hello {user.username} 👋
      </Text>

      {/* RIGHT */}
      <View style={styles.rightActions}>
         <TouchableOpacity
  onPress={() => {
    if (searchVisible) {
      setSearchText('');        // 🔴 reset search
    }
    setSearchVisible(!searchVisible); // 🔁 toggle
  }}
>
  <Icon
    name={searchVisible ? 'close-outline' : 'search-outline'}
    size={26}
    color="#000"
  />
</TouchableOpacity>


                    <TouchableOpacity
            onPress={() =>
                Alert.alert(
                'Logout',
                'Are you sure you want to logout?',
                [
                    { text: 'Cancel', style: 'cancel' },
                    { text: 'Logout', style: 'destructive', onPress: logout },
                ]
                )
            }
            style={styles.avatar}
            >
            <Text style={styles.avatarText}>
                {user?.username?.charAt(0).toUpperCase()}
            </Text>
            </TouchableOpacity>

      </View>
    </View>


             {/* ---------- Search Bar ---------- */}

                    {searchVisible && (
          <View style={styles.searchBox}>
            <TextInput
              placeholder="Search tasks..."
              value={searchText}
              onChangeText={setSearchText}
              style={styles.searchInput}
              autoFocus
            />

            
           </View>
)}




    {/* ---------- Dashboard  ---------- */}

    <Text style={styles.dashboardText}>Dashboard</Text>

       <View style={styles.grid}>
        <View style={[styles.card, { backgroundColor: '#0f4179ff' }]}>
            <Text style={styles.cardText}>All Tasks</Text>
            <Text style={styles.cardCount}>{allTasksCount}</Text>
            <Icon name="list-outline" size={32} color="#fff" style={styles.cardIcon} />
        </View>
        <View style={[styles.card, { backgroundColor: '#246e85ff' }]}>
            <Text style={styles.cardText}>Current Tasks</Text>
            <Text style={styles.cardCount}>{currentTasks.length}</Text>
            <Icon name="today-outline" size={32} color="#ffff"  style={styles.cardIcon}/>
        </View>

        <View style={[styles.card, { backgroundColor: '#189aacff' }]}>
            <Text style={styles.cardText}>Upcoming Tasks</Text>
            <Text style={styles.cardCount}>{upcomingTasks.length}</Text>
            <Icon name="calendar-outline" size={32} color="#ffff" style={styles.cardIcon} />
        </View>

        <View style={[styles.card, { backgroundColor: '#5ba4e0ff' }]}>
            <Text style={styles.cardText}>Completed Tasks</Text>
            <Text style={styles.cardCount}>{completedTasks.length}</Text>
            <Icon name="checkmark-done-outline" size={32} color="#ffff" style={styles.cardIcon}/>
        </View>
      </View>


            {currentTasks.length > 0 && (
      <>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Entypo name="circle" color="#000" size={20} style={{ marginTop: 20,}} />
        <Text style={styles.sectionTitle}>Current Tasks</Text>
      </View>
        {currentTasks.map(item => (
          <TaskItem
            key={item.id}
            item={item}
            isCurrent
            isCompleted={false}
            onComplete={async () => {
              await markCompleted(item.id);
              loadTodos();
            }}
            onEdit={() => {
              Alert.alert(
                'Edit not supported here',
                'Edit tasks from Task List screen'
              );
            }}
            onDelete={async () => {
              await deleteTodo(item.id);
              loadTodos();
            }}
          />
        ))}
      </>
)}

  </View>
</GradientBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 20,
    marginHorizontal: 25,
  },

  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  text: {
    fontSize: 34,
   fontFamily: 'Inter_18pt-Bold',
   color:'#ffff'
  },

  rightActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  avatar: {
    marginLeft: 15,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#0f4179ff',
    justifyContent: 'center',
    alignItems: 'center',
  },

  avatarText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  dashboardText: {
  marginTop: 10,
  fontSize: 25,
  color: '#000',
  fontFamily: 'Inter_18pt-Bold',
},
grid: {
  flexDirection: 'row',
  flexWrap: 'wrap',
  justifyContent: 'space-between',
  marginTop: 25,
},

card: {
  width: '48%',
  height: 150,
  borderRadius: 16,
  padding: 15,
  marginBottom: 15,
  
  elevation: 30,
  position: 'relative'
},

cardText: {
  fontSize: 18,
  fontFamily: 'Inter_18pt-Bold',
  color: '#fff'
},
cardIcon: {
  position: 'absolute',
  bottom: 12,
  right: 12,
},
cardCount: {
  fontSize: 32,
  fontWeight: 'bold',
  color: '#fff',
  left: 45,
  top: 16,
},
sectionTitle: {
  fontSize: 20,
  fontFamily: 'Inter_18pt-Bold',
  marginTop: 25,
  marginBottom: 10,
  marginLeft: 6,
  color: '#000',
},
searchBox: {
  flexDirection: 'row',
  alignItems: 'center',
  marginTop: 15,
  backgroundColor: '#fff',
  borderRadius: 12,
  paddingHorizontal: 15,
  elevation: 4,
},


searchInput: {
  height: 45,
  fontSize: 16,
},
cancelText: {
  marginLeft: 10,
  color: '#1e90ff',
  fontSize: 16,
  fontWeight: 'bold',
},





});


export default DashboardScreen;
