type LinkToPaymentProps = {
  selected: Set<string>;
  total: number;
  quantityTotal: number;
};

const LinkToPayment = ({
  selected,
  total,
  quantityTotal,
}: LinkToPaymentProps) => {
  return (
    <>
      {selected.size > 0 && (
        <div className="w-full  bg-white border-t px-8 py-6 flex justify-end gap-4 items-center rounded shadow">
          <p className="text-gray-600">สินค้า {quantityTotal} ชิ้น</p>
          <p className="text-2xl font-semibold"> {total} ฿</p>
          <button className="text-lg px-4 py-2 button-custom">
            สั่งสินค้า{" "}
          </button>
        </div>
      )}
    </>
  );
};
export default LinkToPayment;
