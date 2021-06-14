import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import fireDB from '../Firebase';
import MainWrapper from '../Components/MainWrapper/MainWrapper';

const OrderDetails = (props) => {
  const { taskId } = useParams();
  console.log(taskId);
  const [taskDetail, setTaskDetail] = useState();

  useEffect(() => {
    const taskDetailsRef = fireDB.database().ref('Orders');
    taskDetailsRef.on('value', (snapshot) => {
      const taskDetailsData = snapshot.val();
      let taskDetailsArray = [];
      for (let task in taskDetailsData) {
        taskDetailsArray.push({ task, ...taskDetailsData[task] });
      }
      console.log(taskDetailsArray);
      const singleTaskDetails = taskDetailsArray.find(
        (task) => task.id === parseInt(taskId)
      );
      setTaskDetail(singleTaskDetails);
    });
  }, []);

  return (
    <div>
      <MainWrapper>
        <div></div>
      </MainWrapper>
    </div>
  );
};

export default OrderDetails;
