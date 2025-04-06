import {useState, useEffect} from 'react';
import Voice from '@react-native-voice/voice';
import axios from 'axios';
// import promptText from '../prompt';
import getFormattedPrompt from '../prompt';
import {URL, API_KEY, API_LINK} from '../config';
import {PermissionsAndroid, Platform} from 'react-native';

const useSpeechHandler = () => {
  const [recognizedText, setRecognizedText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [updatingTaskId, setUpdatingTaskId] = useState(null);

  const requestMicrophonePermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        );
        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          console.warn('Microphone permission denied');
        }
      } catch (err) {
        console.error('Permission error:', err);
      }
    }
  };

  useEffect(() => {
    requestMicrophonePermission();
    fetchTasks();

    Voice.onSpeechStart = () => console.log('Speech started');
    Voice.onSpeechEnd = () => {
      console.log('Speech ended');
      stopListening();
      setIsListening(false);
    };
    Voice.onSpeechResults = async event => {
      const text = event.value?.[0] || '';
      setRecognizedText(text);
      updatingTaskId
        ? await updateTask(updatingTaskId, text)
        : await generateSchedule(text);
    };
    Voice.onSpeechError = error => console.error('Speech error:', error);

    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, [updatingTaskId]);

  const startListening = async () => {
    try {
      setRecognizedText('');
      setIsListening(true);
      await Voice.start('en-IN');
    } catch (error) {
      console.error('Voice start error:', error);
    }
  };

  const stopListening = async () => {
    try {
      setIsListening(false);
      await Voice.stop();
    } catch (error) {
      console.error('Voice stop error:', error);
    }
  };

  const fetchTasks = async () => {
    try {
      const res = await axios.get(`${URL}/get-tasks`);
      setTasks(res.data);
    } catch (err) {
      console.error('Fetch tasks error:', err);
    }
  };

  const deleteTask = async id => {
    try {
      await axios.delete(`${URL}/delete-task/${id}`);
      setTasks(prev => prev.filter(task => task._id !== id));
    } catch (err) {
      console.error('Delete task error:', err);
    }
  };

  const startUpdatingTask = id => {
    setUpdatingTaskId(id);
    startListening();
  };

  const updateTask = async (id, text) => {
    try {
      const res = await axios.post(
        API_LINK,
        {
          model: 'llama3-8b-8192',
          messages: [
            {role: 'system', content: getFormattedPrompt()},
            {
              role: 'user',
              content: `Extract schedule including date, time, and task from: "${text}".`,
            },
          ],
          temperature: 0.3,
          max_tokens: 50,
        },
        {
          headers: {
            Authorization: `Bearer ${API_KEY}`,
            'Content-Type': 'application/json',
          },
        },
      );

      const raw = res.data.choices[0]?.message?.content;
      const jsonMatch = raw.match(/\[.*?\]/s);
      if (!jsonMatch) return console.error('Invalid API response');
      const [item] = JSON.parse(jsonMatch[0]);
      if (!item) return;

      const updateData = {
        ...(item.date && {date: item.date}),
        ...(item.time && {time: item.time}),
        ...(item.task && {task: item.task}),
      };

      await axios.put(`${URL}/update-task/${id}`, updateData);
      setUpdatingTaskId(null);
      fetchTasks();
    } catch (err) {
      console.error('Update error:', err);
    }
  };

  const generateSchedule = async text => {
    if (!text) return;
    try {
      const res = await axios.post(
        API_LINK,
        {
          model: 'llama3-8b-8192',
          messages: [
            {role: 'system', content: getFormattedPrompt()},
            {role: 'user', content: `Extract schedule from: "${text}".`},
          ],
          temperature: 0.3,
          max_tokens: 50,
        },
        {
          headers: {
            Authorization: `Bearer ${API_KEY}`,
            'Content-Type': 'application/json',
          },
        },
      );

      const raw = res.data.choices[0]?.message?.content;
      const jsonMatch = raw.match(/\[.*?\]/s);
      if (!jsonMatch) return console.error('Invalid API response');
      const items = JSON.parse(jsonMatch[0]);

      for (const {date, time, task} of items) {
        await axios.post(`${URL}/save-task`, {date, time, task});
      }

      fetchTasks();
    } catch (err) {
      console.error('Generate schedule error:', err);
    }
  };

  return {
    recognizedText,
    isListening,
    tasks,
    startListening,
    stopListening,
    deleteTask,
    startUpdatingTask,
  };
};

export default useSpeechHandler;
