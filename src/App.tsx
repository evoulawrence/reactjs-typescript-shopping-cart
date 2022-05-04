import { useState } from "react";
import { useQuery } from "react-query";
import {
  Drawer, LinearProgress, Grid, Badge, AppBar, Box, Toolbar, Typography, IconButton as MuiButton, ButtonProps,
  makeStyles
} from "@material-ui/core";
import { AddShoppingCartSharp } from "@material-ui/icons";
import MenuIcon from "@material-ui/icons/Menu";
import Item from "./Item/Item";
import Cart from "./Cart/Cart";
import { Wrapper, StyledButton } from "./App.styles";

export type CartItemType = {
  id: number;
  category: string;
  description: string;
  image: string;
  price: number;
  title: string;
  amount: number;
};

interface IButtonProps extends ButtonProps {
  fontSize?: "small" | "medium" | "large";
  edge?: "start";
}

const useStyles = makeStyles({
  small: {
    size: "0.7em"
  },
  medium: {
    fontSize: "1.0em"
  },
  large: {
    fontSize: "1.4em"
  }
});

function IconButton({ size = "medium", children, ...rest }: IButtonProps) {
  const classes = useStyles();
  return (
    <MuiButton classes={{ label: classes[size] }} {...rest}>
      {children}
    </MuiButton>
  );
}

const getProducts = async (): Promise<CartItemType[]> => {
  return await (await fetch("https://fakestoreapi.com/products")).json();
};

const App = () => {
  const [cartOpen, setCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState([] as CartItemType[]);

  const { data, isLoading, error } = useQuery<CartItemType[]>(
    "id",
    getProducts
  );

  const getTotalItems = (items: CartItemType[]) => items.reduce((ack: number, item) => ack + item.amount, 0);

  const handleAddToCart = (clickedItem: CartItemType) => {
    setCartItems(prev => {
      //1. is item already added in the cart?
      const isItemInCart = prev.find(item => item.id === clickedItem.id);

      if (isItemInCart) {
        return prev.map(item =>
          item.id === clickedItem.id ? { ...item, amount: item.amount + 1 } : item
        )
      }
      //First time item is added
      return [...prev, { ...clickedItem, amount: 1 }]
    })
  };

  const handleRemoveFromCart = (id: number) => {
    setCartItems(prev => (
      prev.reduce((ack, item) => {
        if (item.id === id) {
          if (item.amount === 1) return ack;
          return [...ack, { ...item, amount: item.amount - 1 }];
        } else {
          return [...ack, item];
        }
      }, [] as CartItemType[])
    ))
  };

  if (isLoading) return <LinearProgress />;
  if (error) return <div>Something went wrong ...</div>;
  return (
    <Wrapper>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="fixed" z-index="100">
          <Toolbar>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
            >
              <MenuIcon />
            </IconButton>
            <Typography>
              EL.MENDY SHOP
            </Typography>
            <Drawer anchor="right" open={cartOpen} onClose={() => setCartOpen(false)}>
              <Cart
                cartItems={cartItems}
                addToCart={handleAddToCart}
                removeFromCart={handleRemoveFromCart}
              />
            </Drawer>
            <StyledButton onClick={() => setCartOpen(true)}>
              <Badge badgeContent={getTotalItems(cartItems)} color="error">
                <AddShoppingCartSharp />
              </Badge>
            </StyledButton>
          </Toolbar>
        </AppBar>
      </Box>

      <Grid container spacing={3}>
        {data?.map((item: CartItemType) => {
          return (
            <Grid item key={item.id} xs={12} sm={4}>
              <Item item={item} handleAddToCart={handleAddToCart} />
            </Grid>
          );
        })}
      </Grid>
    </Wrapper>
  );
};

export default App;
