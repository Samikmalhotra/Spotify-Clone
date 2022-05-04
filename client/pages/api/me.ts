import { validateRoute } from "../../lib/auth";

export default validateRoute((req, res, user) => {
  res.status(200).json({ user });
});
