import { Link, useNavigate } from 'react-router-dom';
import { useForm } from "react-hook-form";
import axios from 'axios';
import Swal from 'sweetalert2';
import { useAuth } from './AuthContext';

export function SignUp() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { ApiURL } = useAuth();
  const navigate = useNavigate();
  const onSubmit = data => {
    if (data.signUpConfirmed !== data.signUpPassword) {
      Swal.fire({
        icon: 'error',
        title: '我們不一樣~',
        text: `大會報告! 你的密碼不一樣喔`,
      });
      return;
    }
    axios.post(`${ApiURL}users`, {
      user: {
        email: data.signUpEmail,
        nickname: data.nickname,
        password: data.signUpPassword
      }
    }).then(res => {
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
      });

      return;
    });

  };
  return (<>
    <div id="signUpPage" className="bg-yellow">
      <div className="container signUpPage vhContainer">
        <div className="side">
          <Link to="/"><img className="logoImg" src="https://upload.cc/i1/2022/03/23/rhefZ3.png" alt="" /></Link>
          <img className="d-m-n" src="https://upload.cc/i1/2022/03/23/tj3Bdk.png" alt="workImg" />
        </div>
        <div>
          <form className="formControls" onSubmit={handleSubmit(onSubmit)}>
            <h2 className="formControls_txt">註冊帳號</h2>
            <label className="formControls_label" htmlFor="signUpEmail">Email</label>
            <input className="formControls_input" id="signUpEmail" name="signUpEmail" placeholder="請輸入 email" {...register("signUpEmail", { required: true, pattern: /^\S+@\S+$/i })} />
            {errors.signUpEmail && errors.signUpEmail.type === "required" && <span>此欄位不可留空</span>}
            {errors.signUpEmail && errors.signUpEmail.type === "pattern" && <span>不符合 Email 規則</span>}
            <label className="formControls_label" htmlFor="nickname">您的暱稱</label>
            <input className="formControls_input" type="text" name="nickname" id="nickname" placeholder="請輸入您的暱稱" {...register("nickname", { required: true })} />
            {errors.nickname && <span>此欄位不可留空</span>}
            <label className="formControls_label" htmlFor="signUpPassword">密碼</label>
            <input className="formControls_input" type="password" name="signUpPassword" id="signUpPassword" placeholder="請輸入密碼" {...register("signUpPassword", { required: true })} />
            {errors.signUpPassword && <span>此欄位不可留空</span>}
            <label className="formControls_label" htmlFor="signUpConfirmed">再次輸入密碼</label>
            <input className="formControls_input" type="password" name="signUpConfirmed" id="signUpConfirmed" placeholder="請再次輸入密碼" {...register("signUpConfirmed", { required: true })} />
            {errors.signUpConfirmed && <span>此欄位不可留空</span>}
            <input className="formControls_btnSubmit" type="submit" value="註冊帳號" disabled={Object.keys(errors).length > 0} />
            <Link className="formControls_btnLink" to="/">登入</Link>
          </form>
        </div>
      </div>
    </div>
  </>);
}
