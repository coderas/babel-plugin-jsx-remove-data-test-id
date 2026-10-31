export function LoginForm({ onSubmit }) {
  return (
    <form data-cy="login-form" onSubmit={onSubmit}>
      <input data-qa="username" name="username" />
      <input data-qa="password" name="password" type="password" />
      <button data-test-id="login-submit" type="submit">
        Log in
      </button>
    </form>
  );
}
