import { defineStore } from 'pinia'
import { ref, computed, nextTick } from 'vue'

// 定义接口
interface Task {
  name: string;
  time: string;
  completed: boolean;
}

interface Subtask {
  name: string;
  tasks: Task[];
}

interface Category {
  name: string;
  subtasks: Subtask[];
}

interface TaskWithPath extends Task {
  categoryName: string;
  subtaskName: string;
  categoryIndex: number;
  subtaskIndex: number;
  taskIndex: number;
}

// 创建 store
export const usePlannerStore = defineStore('planner', () => {
  // 状态
  const categories = ref<Category[]>([]);
  const currentCategoryIndex = ref(-1);
  const currentSubtaskIndex = ref(-1);
  
  // 计算属性
  const currentSubtasks = computed(() => {
    if (currentCategoryIndex.value >= 0 && currentCategoryIndex.value < categories.value.length) {
      return categories.value[currentCategoryIndex.value].subtasks;
    }
    return [];
  });
  
  const currentTasks = computed(() => {
    if (currentSubtaskIndex.value >= 0 && currentSubtaskIndex.value < currentSubtasks.value.length) {
      return currentSubtasks.value[currentSubtaskIndex.value].tasks;
    }
    return [];
  });
  
  // 获取所有任务并添加路径信息
  const allTasks = computed(() => {
    const tasks: TaskWithPath[] = [];
    
    categories.value.forEach((category, categoryIndex) => {
      category.subtasks.forEach((subtask, subtaskIndex) => {
        subtask.tasks.forEach((task, taskIndex) => {
          tasks.push({
            ...task,
            categoryName: category.name,
            subtaskName: subtask.name,
            categoryIndex,
            subtaskIndex,
            taskIndex
          });
        });
      });
    });
    
    return tasks;
  });
  
  // 按时间排序的任务
  const sortedAllTasks = computed(() => {
    return [...allTasks.value].sort((a, b) => {
      return a.time.localeCompare(b.time);
    });
  });
  
  // 方法
  // 选择分类
  const selectCategory = (index: number) => {
    currentCategoryIndex.value = index;
    currentSubtaskIndex.value = -1;
  };
  
  // 选择子任务
  const selectSubtask = (index: number) => {
    currentSubtaskIndex.value = index;
  };
  
  // 添加分类
  const addCategory = (name: string) => {
    return new Promise<void>((resolve, reject) => {
      try {
        // 使用更直接的响应式更新方式
        const newCategory = {
          name,
          subtasks: []
        };
        
        // 创建新数组并赋值
        const newCategories = [...categories.value, newCategory];
        categories.value = newCategories;
        
        currentCategoryIndex.value = categories.value.length - 1;
        
        // 强制触发视图更新
        nextTick(() => {
          console.log('分类已添加，当前分类数量:', categories.value.length);
          console.log('当前选中的分类索引:', currentCategoryIndex.value);
        });
        
        saveToLocalStorage()
          .then(() => resolve())
          .catch(error => reject(error));
      } catch (error) {
        console.error('添加分类失败:', error);
        reject(error);
      }
    });
  };
  
  // 编辑分类
  const editCategory = (index: number, name: string) => {
    return new Promise<void>((resolve, reject) => {
      try {
        if (index >= 0 && index < categories.value.length) {
          categories.value[index].name = name;
          saveToLocalStorage()
            .then(() => resolve())
            .catch(error => reject(error));
        } else {
          reject(new Error('无效的分类索引'));
        }
      } catch (error) {
        console.error('编辑分类失败:', error);
        reject(error);
      }
    });
  };
  
  // 删除分类
  const removeCategory = (index: number) => {
    return new Promise<void>((resolve, reject) => {
      try {
        if (index >= 0 && index < categories.value.length) {
          categories.value.splice(index, 1);
          
          if (currentCategoryIndex.value === index) {
            currentCategoryIndex.value = -1;
            currentSubtaskIndex.value = -1;
          } else if (currentCategoryIndex.value > index) {
            currentCategoryIndex.value--;
          }
          
          saveToLocalStorage()
            .then(() => resolve())
            .catch(error => reject(error));
        } else {
          reject(new Error('无效的分类索引'));
        }
      } catch (error) {
        console.error('删除分类失败:', error);
        reject(error);
      }
    });
  };
  
  // 添加子任务
  const addSubtask = (name: string) => {
    return new Promise<void>((resolve, reject) => {
      try {
        if (currentCategoryIndex.value >= 0) {
          // 创建新的子任务
          const newSubtask = {
            name,
            tasks: []
          };
          
          // 创建新数组
          const newSubtasks = [...categories.value[currentCategoryIndex.value].subtasks, newSubtask];
          
          // 创建新的分类数组
          const newCategories = [...categories.value];
          
          // 更新当前分类的子任务
          newCategories[currentCategoryIndex.value] = {
            ...newCategories[currentCategoryIndex.value],
            subtasks: newSubtasks
          };
          
          // 更新分类数组
          categories.value = newCategories;
          
          // 设置当前子任务索引
          currentSubtaskIndex.value = newSubtasks.length - 1;
          
          // 强制触发视图更新
          nextTick(() => {
            console.log('子任务已添加，当前子任务数量:', newSubtasks.length);
            console.log('当前选中的子任务索引:', currentSubtaskIndex.value);
          });
          
          saveToLocalStorage()
            .then(() => resolve())
            .catch(error => reject(error));
        } else {
          reject(new Error('未选择分类'));
        }
      } catch (error) {
        console.error('添加子任务失败:', error);
        reject(error);
      }
    });
  };
  
  // 编辑子任务
  const editSubtask = (index: number, name: string) => {
    if (currentCategoryIndex.value >= 0 && index >= 0 && 
        index < categories.value[currentCategoryIndex.value].subtasks.length) {
      categories.value[currentCategoryIndex.value].subtasks[index].name = name;
      saveToLocalStorage();
    }
  };
  
  // 删除子任务
  const removeSubtask = (index: number) => {
    if (currentCategoryIndex.value >= 0 && index >= 0 && 
        index < categories.value[currentCategoryIndex.value].subtasks.length) {
      categories.value[currentCategoryIndex.value].subtasks.splice(index, 1);
      
      if (currentSubtaskIndex.value === index) {
        currentSubtaskIndex.value = -1;
      } else if (currentSubtaskIndex.value > index) {
        currentSubtaskIndex.value--;
      }
      
      saveToLocalStorage();
    }
  };
  
  // 添加任务
  const addTask = (name: string, time: string) => {
    return new Promise<void>((resolve, reject) => {
      try {
        if (currentCategoryIndex.value >= 0 && currentSubtaskIndex.value >= 0) {
          // 创建新任务
          const newTask = {
            name,
            time,
            completed: false
          };
          
          // 获取当前分类和子任务
          const currentCategory = categories.value[currentCategoryIndex.value];
          const currentSubtask = currentCategory.subtasks[currentSubtaskIndex.value];
          
          // 创建新的任务数组
          const newTasks = [...currentSubtask.tasks, newTask];
          
          // 创建新的子任务数组
          const newSubtasks = [...currentCategory.subtasks];
          newSubtasks[currentSubtaskIndex.value] = {
            ...newSubtasks[currentSubtaskIndex.value],
            tasks: newTasks
          };
          
          // 创建新的分类数组
          const newCategories = [...categories.value];
          newCategories[currentCategoryIndex.value] = {
            ...newCategories[currentCategoryIndex.value],
            subtasks: newSubtasks
          };
          
          // 更新分类数组
          categories.value = newCategories;
          
          // 强制触发视图更新
          nextTick(() => {
            console.log('任务已添加，当前任务数量:', newTasks.length);
          });
          
          saveToLocalStorage()
            .then(() => resolve())
            .catch(error => reject(error));
        } else {
          reject(new Error('未选择分类或子任务'));
        }
      } catch (error) {
        console.error('添加任务失败:', error);
        reject(error);
      }
    });
  };
  
  // 编辑任务
  const editTask = (index: number, name: string, time: string) => {
    if (currentCategoryIndex.value >= 0 && currentSubtaskIndex.value >= 0 && index >= 0 && 
        index < categories.value[currentCategoryIndex.value].subtasks[currentSubtaskIndex.value].tasks.length) {
      const task = categories.value[currentCategoryIndex.value].subtasks[currentSubtaskIndex.value].tasks[index];
      task.name = name;
      task.time = time;
      saveToLocalStorage();
    }
  };
  
  // 删除任务
  const removeTask = (index: number) => {
    if (currentCategoryIndex.value >= 0 && currentSubtaskIndex.value >= 0 && index >= 0 && 
        index < categories.value[currentCategoryIndex.value].subtasks[currentSubtaskIndex.value].tasks.length) {
      categories.value[currentCategoryIndex.value].subtasks[currentSubtaskIndex.value].tasks.splice(index, 1);
      saveToLocalStorage();
    }
  };
  
  // 切换任务状态
  const toggleTaskStatus = (index: number) => {
    if (currentCategoryIndex.value >= 0 && currentSubtaskIndex.value >= 0 && index >= 0 && 
        index < categories.value[currentCategoryIndex.value].subtasks[currentSubtaskIndex.value].tasks.length) {
      const task = categories.value[currentCategoryIndex.value].subtasks[currentSubtaskIndex.value].tasks[index];
      task.completed = !task.completed;
      saveToLocalStorage();
    }
  };
  
  // 切换任务完成状态（打卡功能）
  const toggleTaskCompleted = (task: TaskWithPath) => {
    if (task.categoryIndex >= 0 && task.subtaskIndex >= 0 && task.taskIndex >= 0 && 
        task.categoryIndex < categories.value.length && 
        task.subtaskIndex < categories.value[task.categoryIndex].subtasks.length && 
        task.taskIndex < categories.value[task.categoryIndex].subtasks[task.subtaskIndex].tasks.length) {
      
      const originalTask = categories.value[task.categoryIndex].subtasks[task.subtaskIndex].tasks[task.taskIndex];
      originalTask.completed = !originalTask.completed;
      saveToLocalStorage();
    }
  };
  
  // 本地存储
  const saveToLocalStorage = () => {
    return new Promise<void>((resolve, reject) => {
      try {
        localStorage.setItem('planner-data', JSON.stringify(categories.value));
        console.log('数据已保存到本地存储');
        resolve();
      } catch (error) {
        console.error('保存到本地存储失败:', error);
        reject(error);
      }
    });
  };
  
  const loadFromLocalStorage = () => {
    return new Promise<void>((resolve, reject) => {
      try {
        const data = localStorage.getItem('planner-data');
        if (data) {
          categories.value = JSON.parse(data);
          console.log('从本地存储加载数据成功');
        }
        resolve();
      } catch (error) {
        console.error('从本地存储加载失败:', error);
        reject(error);
      }
    });
  };
  
  // 初始化加载数据
  loadFromLocalStorage();
  
  // 如果没有数据，添加默认数据
  if (categories.value.length === 0) {
    categories.value = [
      {
        name: '雅思9.0分数达成',
        subtasks: [
          {
            name: '听力',
            tasks: [
              { name: '剑桥雅思4听力练习', time: '上午9:00-11:00', completed: false },
              { name: '听力词汇记忆', time: '下午2:00-4:00', completed: true }
            ]
          },
          {
            name: '写作',
            tasks: [
              { name: '大作文范文背诵', time: '上午9:00-10:30', completed: false },
              { name: '小作文图表练习', time: '下午3:00-4:30', completed: false }
            ]
          }
        ]
      },
      {
        name: '健身计划',
        subtasks: [
          {
            name: '力量训练',
            tasks: [
              { name: '胸肌训练', time: '周一、周四 晚上7:00', completed: false },
              { name: '背部训练', time: '周二、周五 晚上7:00', completed: false }
            ]
          }
        ]
      }
    ];
    saveToLocalStorage();
  }
  
  return {
    categories,
    currentCategoryIndex,
    currentSubtaskIndex,
    currentSubtasks,
    currentTasks,
    allTasks,
    sortedAllTasks,
    selectCategory,
    selectSubtask,
    addCategory,
    editCategory,
    removeCategory,
    addSubtask,
    editSubtask,
    removeSubtask,
    addTask,
    editTask,
    removeTask,
    toggleTaskStatus,
    toggleTaskCompleted,
    loadFromLocalStorage
  }
}) 