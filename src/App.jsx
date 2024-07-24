import Cart from './components/Cart.jsx';
import Meals from './components/Meals.jsx';
import Header from './components/Header.jsx';
import { CartContextProvider } from './store/CartContext.jsx';
import { UserProgressContextProvider } from './store/UserProgressContext.jsx';
import Checkout from './components/Checkout.jsx';
function App() {
  return (
    <UserProgressContextProvider>
      <CartContextProvider>
        <Header/>
        <Meals/>
        <Cart/>
        <Checkout/>
      </CartContextProvider>
      </UserProgressContextProvider>
  );
}

export default App;
