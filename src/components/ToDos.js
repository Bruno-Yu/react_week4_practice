import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useAuth } from './AuthContext';

export function ToDos() {
  const { userName, data, setData, ApiURL } = useAuth();
  const [input, setInput] = useState('');
  const [showData, setShowData] = useState([]);
  const navigate = useNavigate();
  function getData() {
    axios.get(`${ApiURL}todos`).then(res => {
      setData(res.data.todos);
    });
  }
  function addItem() {
    if (input.trim().length !== 0) {
      const addIn = { 'todo': { 'content': input } };
      axios.post(`${ApiURL}/todos`, addIn).then(res => {
        console.log('新增成功', input);
        getData();
        setInput('');

      });
    } else {
      Swal.fire({
        icon: 'error',
        title: '喔~ 大哥&大姊',
        text: `沒有代辦內容讓網頁我很難辦餒`,
      });
    }
  }
  function ToggleTab(e) {
    const tabs = document.querySelectorAll('.todoList_tab button');
    function removeActive() {
      tabs.forEach(item => {
        if (item.classList.contains('active')) {
          item.classList.remove('active');
        }
      });
    }
    if (e.target.dataset.btn === 'all') {
      setShowData(data);
      removeActive();
      e.target.classList.add('active');
    } else if (e.target.dataset.btn === "todo") {
      let newData = data.filter(item => item.completed_at === null);
      removeActive();
      e.target.classList.add('active');
      setShowData(newData);
    } else if (e.target.dataset.btn === "done") {
      let newData = data.filter(item => item.completed_at !== null);
      removeActive();
      e.target.classList.add('active');
      setShowData(newData);
    }
  }
  // 修改狀態
  function ToggleChange(e, id) {
    axios.patch(`${ApiURL}todos/${id}/toggle`).then((res) => {
      getData();
    });
  }
  // 刪除單一代辦
  function deleteTodo(id) {
    axios.delete(`${ApiURL}/todos/${id}`).then((res) => {
      getData();
    });
  }
  // 刪除已完成代辦
  function deleteDone() {
    data.forEach(item => {
      if (item.completed_at !== null) {
        deleteTodo(item.id);
      }
    });
    getData();
  }
  // 登出
  function logOut() {
    axios.delete(`${ApiURL}users/sign_out`).then(() => {
      delete axios.defaults.headers.common["Authorization"];
      Swal.fire({
        icon: 'success',
        title: '登出',
        text: `成功登出喔!`,
      });
      navigate('/');
    });
  }

  useEffect(() => {
    setShowData(data);
  }, [data]);

  return (<>
    <div id="todoListPage" className="bg-half">
      <nav>
        <h1><Link to='/todos'>ONLINE TODO LIST</Link></h1>
        <ul>
          <li className="todo_sm"><Link to='/todos'><span>{userName}的代辦</span></Link></li>
          <li><Link to="#" onClick={logOut}>登出</Link></li>
        </ul>
      </nav>
      <div className="conatiner todoListPage vhContainer">
        <div className="todoList_Content">
          <div className="inputBox">
            <input type="text" placeholder="請輸入待辦事項" value={input} onChange={(e) => {
              setInput(e.target.value);
            }} />
            <button onClick={addItem}>
              <i className="fa fa-plus white"></i>
            </button>
          </div>
          {data.length ? (<>
            <div className="todoList_list">
              <ul className="todoList_tab">
                <li><button type="button" data-btn="all" className="active" onClick={(e) => { ToggleTab(e); }}>全部</button></li>
                <li><button type="button" data-btn="todo" onClick={(e) => { ToggleTab(e); }}>待完成</button></li>
                <li><button type="button" data-btn="done" onClick={(e) => { ToggleTab(e); }}>已完成</button></li>
              </ul>
              <div className="todoList_items">
                <ul className="todoList_item">
                  {showData.map((item, index) => {
                    return (<>
                      <li id={item.id}>
                        <label className="todoList_label">
                          <input className="todoList_input" type="checkbox" value="true" checked={item.completed_at === null ? false : true} onClick={(e) => { ToggleChange(e, item.id); }} />
                          <span>{item.content}</span>
                        </label>
                        <Link to="#" onClick={() => { deleteTodo(item.id); }}>
                          <i className="fa fa-times"></i>
                        </Link>
                      </li>
                    </>);
                  })}
                </ul>
                <div className="todoList_statistics">
                  <p> {data.filter(item => item.completed_at === null).length} 個未完成項目</p>
                  <Link to="#" onClick={deleteDone}>清除已完成項目</Link>
                </div>
              </div>
            </div> </>) : ("目前尚未有資料")}

        </div>
      </div>
    </div>

  </>);
}
