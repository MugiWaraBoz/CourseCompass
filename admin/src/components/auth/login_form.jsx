import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { loginUser } from '@/api/authAPI';

export function InputForm() {
  const roles = ['admin', 'moderator'];
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setError(null);
    const formData = new FormData(event.target);
    const credentials = {
      email: formData.get('form-email'),
      password: formData.get('form-password'),
      role: formData.get('form-role'),
    };
    // console.log(event.target);

    await loginUser(credentials)
      .then((res) => {
        localStorage.setItem('token', res.token);
        navigate('/dashboard');
      })
      .catch((error) => {
        // console.error('Login error:', error);
        setError(error.message || 'Unable to login. Please try again.');
      })
      .finally(() => {
        setLoading(false);
      });
  }

  return (
    <form
      autoComplete="off"
      className="w-full max-w-sm"
      onSubmit={handleSubmit}
    >
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="form-email">Email</FieldLabel>
          <Input
            id="form-email"
            name="form-email"
            type="email"
            placeholder="john@example.com"
            autoComplete="off"
            required
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="form-password">Password</FieldLabel>
          <Input
            id="form-password"
            name="form-password"
            type="password"
            placeholder="********"
            autoComplete="new-password"
            required
          />
        </Field>

        <Field>
          <FieldLabel htmlFor="form-role">Role</FieldLabel>
          <Select id="form-role" name="form-role" required>
            <SelectTrigger>
              <SelectValue placeholder="Select a role" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {roles.map((role) => (
                  <SelectItem key={role} value={role}>
                    {role}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </Field>

        <Field orientation="horizontal">
          <div className="flex w-full flex-col gap-2">
            {error && (
              <div className="rounded-lg border border-red-400/30 bg-red-400/10 p-3 text-sm text-red-300">
                {error}
              </div>
            )}

            <div className="flex justify-end gap-2">
              <Button
                className="bg-red-500 hover:bg-red-600 text-white"
                type="button"
                variant="base"
              >
                Cancel
              </Button>
              <Button
                className="bg-blue-500 hover:bg-blue-600 text-white"
                type="submit"
              >
                {loading ? 'Logging in...' : 'Submit'}
              </Button>
            </div>
          </div>
        </Field>
      </FieldGroup>
    </form>
  );
}
