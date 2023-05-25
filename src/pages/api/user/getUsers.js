import { generateFakeData } from "@/utils/helpers";

export default function getUsers(req, res) {
  const usersData = generateFakeData(100);

  res.status(200).json(usersData);
}
