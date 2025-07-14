const SuccessPageOmise = () => {
  return (
    <div className="mt-80 max-w-xl mx-auto p-6 border rounded-lg shadow-md text-center">
      <h1 className="text-2xl font-bold mb-4">🎉 ชำระเงินสำเร็จ</h1>
      <p className="text-muted-foreground mb-6">
        ขอบคุณสำหรับการสั่งซื้อ ระบบได้รับการชำระเงินของคุณเรียบร้อยแล้ว
      </p>

      <a
        href="/account/orders"
        className="button-custom inline-block px-6 py-2"
      >
        📦 ไปยังคำสั่งซื้อของฉัน
      </a>
    </div>
  );
};

export default SuccessPageOmise;
