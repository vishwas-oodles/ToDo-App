import React from 'react';
import { View, Text, Button, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Entypo from 'react-native-vector-icons/Entypo';
import  Swipeable  from 'react-native-gesture-handler/Swipeable';


const getPriorityStyle = (priority) => {
  switch (priority) {
    case 'High':
      return {
        color: '#ffff',          // White text
        backgroundColor: '#ec1313ff' //  red bg
      };
    case 'Medium':
      return {
        color: '#fff7e6',          // white text
        backgroundColor:  '#faad14',// yellow bg
      };
    case 'Low':
      return {
        color: '#edf7ed',          // white text
        backgroundColor: '#52c41a', //  green bg
      };
    default:
      return {
        color: '#555',
        backgroundColor: 'transparent'
      };
  }
};



const TaskItem = ({
  item,
  isCurrent,
  isCompleted,
  onComplete,
  onEdit,
  onDelete,
}) => {

  const renderRightActions = () => {
  return (
    <TouchableOpacity style={styles.swipeDelete} onPress={onDelete}>
      <Icon name="trash-outline" size={28} color="#fff" />
      <Text style={{ color: '#fff', marginTop: 4 }}>Delete</Text>
    </TouchableOpacity>
  );
};

  const renderLeftActions = () => {
  return (
     <TouchableOpacity style={styles.swipeDelete} onPress={onDelete}>
      <Icon name="trash-outline" size={28} color="#fff" />
      <Text style={{ color: '#fff', marginTop: 4 }}>Delete</Text>
    </TouchableOpacity>
  );
};

  const Content = (
    <View style={styles.todoItem}>
        <View style={{ flex: 1, flexDirection: 'row' }}>
            <FontAwesome name="circle" color="#0584b6ff" size={18} style={{marginTop: 10, marginLeft: 10}} />
            <View style={{ flex: 1, marginLeft: 6}}>
                    <Text style={[styles.todoText, isCompleted && styles.completed]}>
                    {item.title}
                    </Text>
                    <Text
                                    style={[
                                      styles.priority,
                                      getPriorityStyle(item.priority)
                                    ]}
                                  >
                                    {item.priority}
                                  </Text>
            </View>
        </View>
                
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        {isCurrent && (
          <TouchableOpacity
            onPress={onComplete}
            style={styles.completeBtn}
          >
            <Entypo name="check" color="#52c41a" size={24} />   
          </TouchableOpacity>
        )}

       <View style={styles.actionRow}>
        {!isCompleted && (
          <TouchableOpacity onPress={onEdit} style={styles.iconBtn}>
            <FontAwesome name="edit" size={22} color="#0b5ed7"  />
          </TouchableOpacity>
        )}

        <TouchableOpacity onPress={onDelete} style={styles.iconBtn}>
          <Icon name="trash-outline" size={22} color="#dc3545" />
        </TouchableOpacity>
      </View>

      </View>
    </View>

  );

  return isCurrent ? (

    <Swipeable 
    renderRightActions={renderRightActions}
     renderLeftActions={renderLeftActions}>
      {Content}
    </Swipeable>
  ) : (
    Content
      );
};

const styles = StyleSheet.create({
  todoItem: {
    flexDirection: 'row',
    paddingVertical: 10,
    borderLeftWidth: 6,
    borderLeftColor: '#19475cff' ,
    backgroundColor: '#b2dafaff',
    borderRadius: 20,
    elevation: 6,
    marginBottom: 10,
  },
  todoText: { fontSize: 20, fontFamily: 'Inter_18pt-Bold' },
  completed: { textDecorationLine: 'line-through', color: '#999' },
  priority: { fontSize: 12, 
    fontFamily: 'Inter_18pt-Bold',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    alignSelf: 'flex-start',
    overflow: 'hidden',
 },
 actionRow: {
  flexDirection: 'row',
  alignItems: 'center',
  marginRight: 10,
},

iconBtn: {
  marginLeft: 10,
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
},
swipeDelete: {
  backgroundColor: '#dc3545',
  justifyContent: 'center',
  alignItems: 'center',
  width: 90,
  marginBottom: 10,
  borderRadius: 20,
},


});

export default TaskItem;
