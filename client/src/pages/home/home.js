import Navbar from "../../components/navbar";

const Home = () => {
  const tasks = [
    { id: 1, title: "Task 1", completed: false },
    { id: 2, title: "Task 2", completed: true },
    { id: 3, title: "Task 3", completed: false },
  ];

  const getEmoji = (completed) => {
    return completed ? (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6 text-green-500"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M5 13l4 4L19 7"
        />
      </svg>
    ) : (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6 text-red-500"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M15 12H9m12 0c0 3.866-3.134 7-7 7s-7-3.134-7-7 3.134-7 7-7 7 3.134 7 7zm-7 0V8m0 8h.01"
        />
      </svg>
    );
  };

  return (
    <div>
      <Navbar />
      <div className="max-w-2xl mx-auto mt-10">
        <h1 className="text-3xl font-bold text-center mb-6">My Tasks</h1>
        <ul className="space-y-4">
          {tasks.map((task) => (
            <li
              key={task.id}
              className="flex justify-between items-center p-4 bg-white shadow rounded-lg"
            >
              <span>{task.title}</span>
              {getEmoji(task.completed)}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Home;
