function MenuBlock({ items }) {
    return (
      <nav style={{ padding: '20px', backgroundColor: '#f5f5f5' }}>
        {items.map((item, index) => (
          <a key={index} href={item.link} style={{ marginRight: '20px' }}>
            {item.name}
          </a>
        ))}
      </nav>
    );
  }
  
  export default MenuBlock;
  