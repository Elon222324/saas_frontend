function Container({ children }) {
    return (
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "0 20px",
        }}
      >
        {children}
      </div>
    );
  }
  
  export default Container;
  