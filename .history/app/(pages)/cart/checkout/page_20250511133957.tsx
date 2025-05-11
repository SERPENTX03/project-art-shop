const CheckoutCart = async () => {
  const res = await fetch(
    "https://thaiaddressapi-thaikub.herokuapp.com/v1/thailand/provinces"
  );
  if (!res.ok) {
    const errorRes = await res.json();
    throw new Error(errorRes);
  }
  return <div>CheckoutCart</div>;
};
export default CheckoutCart;
