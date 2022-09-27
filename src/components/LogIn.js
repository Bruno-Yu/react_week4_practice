import { Link, useNavigate } from 'react-router-dom';
import { useForm } from "react-hook-form";
import axios from 'axios';
import Swal from 'sweetalert2';
import { useAuth } from './AuthContext';

export function LogIn() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { token, setToken, userName, setUserName, setData, ApiURL } = useAuth();
  const navigate = useNavigate();
  function getData() {
    axios.get(`${ApiURL}todos`).then(res => {
      setData(res.data.todos);
    });
  }
  const onSubmitEvent = data => {
    axios.post(`${ApiURL}users/sign_in`, {
      user: {
        email: data.email,
        password: data.password
      }
    }).then(res => {
      setToken(res.headers.authorization);
      setUserName(res.data.nickname);
      console.log(token, userName);
      Swal.fire({
        icon: 'success',
        title: '你進入了~ 羞',
        text: `成功登錄哩~ 立馬跳轉`,
      });
      // 存驗證權杖進headers
      axios.defaults.headers.common["Authorization"] = res.headers.authorization;
      getData();
      navigate('/todos');
    }).catch(error => {
      console.log(error);
      Swal.fire({
        icon: 'error',
        title: '我很抱歉...',
        text: `${error.response.data.message}:信箱或密碼錯誤`,
      });
    });

  };
  return (<>
    <div id="loginPage" className="bg-yellow">
      <div className="container loginPage vhContainer ">
        <div className="side">
          <Link to="/"><img className="logoImg" src="https://upload.cc/i1/2022/03/23/rhefZ3.png" alt="" /></Link>
          <img className="d-m-n" src="https://upload.cc/i1/2022/03/23/tj3Bdk.png" alt="workImg" />
        </div>
        <div>
          <form className="formControls" onSubmit={handleSubmit(onSubmitEvent)}>
            <h2 className="formControls_txt">最實用的線上代辦事項服務</h2>
            <label className="formControls_label" htmlFor="email">Email</label>
            <input className="formControls_input" name='email' id='email' placeholder="請輸入 email" {...register("email", { required: { value: true, message: "此欄位必填" }, pattern: { value: /^\S+@\S+$/i, message: '不符合 Email 規則' } })} />
            {errors.email && errors.email.type === "required" && <span>此欄位不可留空</span>}
            {errors.email && errors.email.type === "pattern" && <span>不符合 Email 規則</span>}
            <label className="formControls_label" htmlFor="password">密碼</label>
            <input className="formControls_input" name="password" id="password" type="password" placeholder="請輸入密碼" {...register("password", { required: true })} />
            {errors.password && <span>此欄位不可留空</span>}
            <input className="formControls_btnSubmit" type="submit" value="登入" disabled={Object.keys(errors).length > 0} />
            <Link className="formControls_btnLink" to="/signup">註冊帳號</Link>
          </form>
        </div>
      </div>
    </div>

  </>);
}
