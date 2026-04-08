import { Provider } from 'react-redux';
import { store } from './store';
import './index.css';
import WallCalendar from './components/WallCalendar';

export default function App() {
  return (
    <Provider store={store}>
      <WallCalendar />
    </Provider>
  );
}
