// import logo from './logo.svg';
import './App.css';
import { useState, useEffect } from 'react';
// eslint-disable-next-line no-unused-vars
import { Routes, Route, Link, Outlet, useNavigate } from 'react-router-dom';
import { createContext, useContext } from 'react';
import { useForm } from "react-hook-form";
import axios from 'axios';
import Swal from 'sweetalert2';

  const AuthContext = createContext(null);

function LogIn() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { token, setToken, userName, setUserName , setData} = useContext(AuthContext);
  const navigate = useNavigate();
    function getData() {
    const ApiUrl = 'https://todoo.5xcamp.us/todos'
    axios.get(ApiUrl).then(res => { 
      setData(res.data.todos);
    })
    }
  const onSubmitEvent = data => {
    const ApiUrl = 'https://todoo.5xcamp.us/users/sign_in'
    axios.post(ApiUrl, {
      user: {
        email: data.email , 
      password: data.password
    } }).then(res => {

      // alert(`送出成功:${JSON.stringify(res.data)}`);
      // console.log(res);
      setToken(res.headers.authorization);
      setUserName(res.data.nickname);
      console.log(token, userName);
    Swal.fire({
      icon: 'success',
      title: '你進入了~ 羞',
      text: `成功登錄哩~ 立馬跳轉`,
    })
      // 存驗證權杖進headers
      axios.defaults.headers.common["Authorization"] = res.headers.authorization;
      getData();
      navigate('/todos');
    }).catch(error => {
        Swal.fire({
      icon: 'error',
      title: '我很抱歉...',
      text: `${error.response.data.message}:${error.message}`,
        })
    })

  };
  return (<>
      <div id="loginPage" className="bg-yellow">
        <div className="conatiner loginPage vhContainer ">
            <div className="side">
                <Link to="/"><img className="logoImg" src="https://upload.cc/i1/2022/03/23/rhefZ3.png" alt="" /></Link>
                <img className="d-m-n" src="https://upload.cc/i1/2022/03/23/tj3Bdk.png" alt="workImg" />
            </div>
        <div>
          <form className="formControls" onSubmit={handleSubmit(onSubmitEvent)}>
            <h2 className="formControls_txt">最實用的線上代辦事項服務</h2>
            <label className="formControls_label" htmlFor="email">Email</label>
            <input className="formControls_input" name='email' id='email'  type="email" placeholder="請輸入 email" {...register("email", { required: true, pattern: /^\S+@\S+$/i })} />
            {errors.email && <span>此欄位不可留空</span>}
            <label className="formControls_label" htmlFor="password">密碼</label>
            <input className="formControls_input" name="password" id="password" type="password" placeholder="請輸入密碼" {...register("password", {required: true})} />
            { errors.password && <span>此欄位不可留空</span>}
            <input className="formControls_btnSubmit" type="submit"  value="登入" />
            <Link className="formControls_btnLink" to="/signup">註冊帳號</Link>
            </form>
            </div>
        </div>
    </div>
  
  </>)
}

function SignUp() { 
  const { register, handleSubmit, formState: { errors } } = useForm();
    const navigate = useNavigate();
  const onSubmit = data => {
    const ApiUrl = `https://todoo.5xcamp.us/users`
    if (data.signUpConfirmed !== data.signUpPassword) {
      Swal.fire({
        icon: 'error',
        title: '我們不一樣~',
        text: `大會報告! 你的密碼不一樣喔`,
      });
      return;
    }
    axios.post(ApiUrl, {
      user: {
        email: data.signUpEmail,
        nickname: data.nickname,
        password: data.signUpPassword
    }}).then(res => {
      Swal.fire({
        icon: 'success',
        title: '水拉水拉!',
        text: `註冊成功餒! 馬上幫你轉到登入ya~`,
      });
      navigate('/');
    }).catch(error => {
      console.log(error);
      Swal.fire({
      icon: 'error',
      title: '我很抱歉...',
      text: `${error.response.data.message}:${error.response.data.error[0]}`,
      })

      return;
    })

  };
  return (<>
      <div id="signUpPage" className="bg-yellow">
        <div className="conatiner signUpPage vhContainer">
            <div className="side">
                <Link to="/"><img className="logoImg" src="https://upload.cc/i1/2022/03/23/rhefZ3.png" alt="" /></Link>
                <img className="d-m-n" src="https://upload.cc/i1/2022/03/23/tj3Bdk.png" alt="workImg" />
            </div>
        <div>
                <form className="formControls" onSubmit={handleSubmit(onSubmit)} >
                    <h2 className="formControls_txt">註冊帳號</h2>
                    <label className="formControls_label" htmlFor="signUpEmail">Email</label>
                    <input className="formControls_input" type="email" id="signUpEmail" name="signUpEmail" placeholder="請輸入 email" {...register("signUpEmail", {required: true, pattern: /^\S+@\S+$/i})} />
                    { errors.signUpEmail && <span>此欄位不可留空</span>}
                    <label className="formControls_label" htmlFor="nickname">您的暱稱</label>
                    <input className="formControls_input" type="text" name="nickname" id="nickname" placeholder="請輸入您的暱稱" {...register("nickname", {required: true})}/>
                    { errors.nickname && <span>此欄位不可留空</span>}
                    <label className="formControls_label" htmlFor="signUpPassword">密碼</label>
                    <input className="formControls_input" type="password" name="signUpPassword" id="signUpPassword" placeholder="請輸入密碼" {...register("signUpPassword", {required: true})}  />
                    { errors.signUpPassword && <span>此欄位不可留空</span>}
                    <label className="formControls_label" htmlFor="signUpConfirmed">再次輸入密碼</label>
                    <input className="formControls_input" type="password" name="signUpConfirmed" id="signUpConfirmed" placeholder="請再次輸入密碼" {...register("signUpConfirmed", {required: true})} />
                    { errors.signUpConfirmed && <span>此欄位不可留空</span>}
                    <input className="formControls_btnSubmit" type="submit" value="註冊帳號" />
                    <Link className="formControls_btnLink" to="/">登入</Link>
                </form>
            </div>
        </div>
    </div>
  </>)
}



function ToDos() { 
    const ApiUrl = 'https://todoo.5xcamp.us/todos'
  const { userName, data, setData } = useContext(AuthContext);
  const [input, setInput] = useState('');
  const [showData, setShowData] = useState([]);
  const navigate = useNavigate();
  function getData() {
     const ApiUrl = 'https://todoo.5xcamp.us/todos'
    axios.get(ApiUrl).then(res => { 
      setData(res.data.todos);
    })
   }
  function addItem() {
    if (input.trim().length !== 0) {
      const addIn = { 'todo': { 'content': input } };
      axios.post(ApiUrl, addIn).then(res => {
        console.log('新增成功', input);
        getData();
        setInput('');
        
      })
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
      })
    }
    if (e.target.dataset.btn === 'all') {
      setShowData(data);
      removeActive();
      e.target.classList.add('active');
    } else if (e.target.dataset.btn === "todo") {
      let newData = data.filter(item => item.completed_at ===null );
      removeActive();
      e.target.classList.add('active');
      setShowData(newData);
    } else if (e.target.dataset.btn === "done") {
      let newData = data.filter(item => item.completed_at !== null );
      removeActive();
      e.target.classList.add('active');
      setShowData(newData);
    }
  }
// 修改狀態
  function ToggleChange(e, id) { 
    const api = `https://todoo.5xcamp.us/todos/${id}/toggle`
    axios.patch(api).then((res) => { 
      getData();
    })
  }
  // 刪除單一代辦
  function deleteTodo(id) { 
    const api = `https://todoo.5xcamp.us/todos/${id}`
    axios.delete(api).then((res) => {
      getData();
    })
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
    const api = `https://todoo.5xcamp.us/users/sign_out`
    axios.delete(api).then(() => {
      console.log('順利登出');
      delete axios.defaults.headers.common["Authorization"];
        Swal.fire({
        icon: 'success',
        title: '登出',
        text: `成功登出喔!`,
      });
      navigate('/');
    })
  }

  useEffect(() => { 
    setShowData(data);
  },[data])

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
            } } />
            <button onClick={addItem}>
                        <i className="fa fa-plus white" ></i>
                    </button>
          </div>
          {data.length ? ( <>
            <div className="todoList_list">
              <ul className="todoList_tab">
                <li><button type="button" data-btn="all" className="active" onClick={(e) => {ToggleTab(e)} }>全部</button></li>
                        <li><button type="button" data-btn="todo" onClick={(e) => {ToggleTab(e)} }>待完成</button></li>
                        <li><button type="button" data-btn="done" onClick={(e) => {ToggleTab(e)} }>已完成</button></li>
              </ul>
                    <div className="todoList_items">
                <ul className="todoList_item">
                  {showData.map((item, index) => { 
                    return (<>
                      <li id={item.id}>
                          <label className="todoList_label">
                          <input className="todoList_input" type="checkbox" value="true" checked={item.completed_at === null ? false : true} onClick={(e) => {ToggleChange(e, item.id) } } />
                          <span>{ item.content}</span>
                        </label>
                        <Link to="#" onClick={() => { deleteTodo(item.id)}}>
                                    <i className="fa fa-times"></i>
                                </Link>
                      </li>
                    </>)
                  }) }
                        </ul>
                        <div className="todoList_statistics">
                            <p> {  data.filter(item => item.completed_at ===null ).length  } 個未完成項目</p>
                  <Link to="#" onClick={ deleteDone} >清除已完成項目</Link>
                        </div>
                    </div>
                </div> </>) : ("目前尚未有資料" )}
                
            </div>
        </div>
    </div>
  
  </>)
}

function App() {

  const [token, setToken] = useState(null); 
  const [userName, setUserName] = useState('');
  const [data, setData] = useState([]);
  return (
    <div className="App">

      <AuthContext.Provider value={{ token, setToken, userName, setUserName, data, setData }}>
        <Routes>
          <Route path='/' element={<LogIn />} />
          <Route path='/signup' element={<SignUp/>} />
          <Route path='/todos' element={<ToDos/>} />
      </Routes>

      </AuthContext.Provider>
      
    </div>
  );
}

export default App;
