import { faker } from "@faker-js/faker";

const calculateDaysSinceRegistered = (registeredDate) => {
  const today = new Date();
  const diffTime = Math.abs(today - new Date(registeredDate));
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return `${diffDays} days ago`;
};

const generateFakeData = (count) => {
  return Array.from({ length: count }, () => ({
    id: faker.datatype.uuid(),
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    email: faker.internet.email(),
    city: faker.address.city(),
    registeredDate: JSON.parse(JSON.stringify(faker.date.past())).split("T")[0],
    fullName: `${faker.name.firstName()} ${faker.name.lastName()}`,
    dateSinceRegistered: calculateDaysSinceRegistered(
      JSON.parse(JSON.stringify(faker.date.past()))
    ),
  }));
};

function toCamelCase(str) {
  return str
    .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) =>
      index === 0 ? word.toLowerCase() : word.toUpperCase()
    )
    .replace(/\s+/g, "");
}

const saveToLocalStorage = (key, content) => {
  if (typeof window !== "undefined") {
    localStorage.setItem(key, JSON.stringify(content));
  }
};

const getFromLocalStorage = (key) => {
  if (typeof window !== "undefined") {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  }
};

export {
  generateFakeData,
  toCamelCase,
  saveToLocalStorage,
  getFromLocalStorage,
};
