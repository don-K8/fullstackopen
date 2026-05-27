import { TextField, Button } from "@mui/material"

const LoginForm = ({
  handleSubmit,
  handleUsernameChange,
  handlePasswordChange,
  username,
  password
}) => {
  return (
    <form onSubmit={handleSubmit}>
      <div>
        <h2>Log in to application</h2>
        <TextField
          label="username"
          variant="standard"
          value={username}
          onChange={handleUsernameChange}
          slotProps={{
            inputLabel: { sx: { paddingLeft: 1.5 } }
          }}
        />
      </div>
      <div>
        <TextField
          label="password"
          variant="standard"
          value={password}
          onChange={handlePasswordChange}
          slotProps={{
            inputLabel: { sx: { paddingLeft: 1.5 } }
          }}
        />
      </div>
      <Button type="submit" variant="contained" style={{ marginTop: 10 }}>
        login
      </Button>
    </form>
  )
}

export default LoginForm