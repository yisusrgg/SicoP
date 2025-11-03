import React from "react";
import "./Login.css";

const Login = () => {
  return (
    <div className="login-container">
      <h2>Iniciar Sesión</h2>
      <form onSubmit={(e) => e.preventDefault()}>
        <div className="input-group">
          <label htmlFor="username">Usuario</label>
          <input type="text" id="username" name="username" required />
        </div>

        <div className="input-group">
          <label htmlFor="password">Contraseña</label>
          <input type="password" id="password" name="password" required />
        </div>

        <button type="submit">Ingresar</button>

        <p className="register-text">
          ¿No tienes cuenta? <a href="#">Regístrate</a>
        </p>
      </form>
    </div>
  );
};

export default Login;

/*<link href="https://fonts.googleapis.com/css2?family=Lato:wght@400;500;700&display=swap" rel="stylesheet">
<link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap" rel="stylesheet">
*/