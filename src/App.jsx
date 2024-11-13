import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Home from './pages/Home/Home';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import TripDetails from './pages/TripDetails/TripDetails';
import Navbar from './components/Navbar/Navbar';
import ExpenseList from './pages/Expenses/ExpenseList';
import AddExpense from './pages/Expenses/AddExpense';
import TaskList from './pages/Tasks/TaskList';
import AddTask from './pages/Tasks/AddTask';
import PollList from './pages/Polls/PollList';
import AddPoll from './pages/Polls/AddPoll';

function App() {
  return (
    <Router>
      <Navbar />
      <Switch>
        <Route exact path="/" component={Home} />
        <Route path="/login" component={Login} />
        <Route path="/register" component={Register} />
        <Route path="/trip/:tripId" component={TripDetails} />
        <Route path="/trip/:tripId/expenses" component={ExpenseList} />
        <Route path="/trip/:tripId/add-expense" component={AddExpense} />
        <Route path="/trip/:tripId/tasks" component={TaskList} />
        <Route path="/trip/:tripId/add-task" component={AddTask} />
        <Route path="/trip/:tripId/polls" component={PollList} />
        <Route path="/trip/:tripId/add-poll" component={AddPoll} />
      </Switch>
    </Router>
  );
}

export default App;
