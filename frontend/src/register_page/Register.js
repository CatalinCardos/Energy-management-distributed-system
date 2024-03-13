export function Register()
{
    return(
        <div className="Login">
        <header className="Login-header">
          <p>
            SIGN UP
          </p>
        </header>
        <div className="Login-form">
          <div className="Login-inputbox">
            <input className="Login-input" type="text" placeholder="Username" />
          </div>
          <div className="Login-inputbox">
            <input className="Login-input" type="password" placeholder="Password" />
          </div>
          <div className="Login-inputbox">
            <input className="Login-input" type="password" placeholder="Confirm Password" />
          </div>
          <button className="Login-button" type="button">Sign up</button>
        <text>Already have an account? <a href='/'>Sign in</a>
        </text>
        </div>
        </div>
    );
}