import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function InputForm() {
  const roles = ["Admin", "Moderator"];
  const navigate = useNavigate();

  function handleSubmit(event) {
    event.preventDefault();
    localStorage.setItem("courseCompassAuth", "true");
    navigate("/dashboard");
  }

  return (
    <form className="w-full max-w-sm" onSubmit={handleSubmit}>
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="form-email">Email</FieldLabel>
          <Input id="form-email" type="email" placeholder="john@example.com" required />
        </Field>
        <Field>
          <FieldLabel htmlFor="form-password">Password</FieldLabel>
          <Input id="form-password" type="password" placeholder="********" required />
        </Field>

        <Field>
          <FieldLabel htmlFor="form-role">Role</FieldLabel>
          <Select>
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
          <Button className="bg-red-500 hover:bg-red-600 text-white" type="button" variant="base">
            Cancel
          </Button>
          <Button className="bg-blue-500 hover:bg-blue-600 text-white" type="submit">
            Submit
          </Button>
        </Field>
      </FieldGroup>
    </form>
  );
}
