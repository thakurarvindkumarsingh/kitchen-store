function Categories({ setCategory }) {
  return (
    <div className="categories">

      <div className="cat" onClick={() => setCategory("All")}>
        All
      </div>

      <div className="cat" onClick={() => setCategory("Cookware")}>
        Cookware 🍲
      </div>

      <div className="cat" onClick={() => setCategory("Utensils")}>
        Utensils 🍴
      </div>

      <div className="cat" onClick={() => setCategory("Storage")}>
        Storage 🥫
      </div>

      <div className="cat" onClick={() => setCategory("Appliances")}>
        Appliances ⚡
      </div>

    </div>

    
  );
}

export default Categories;