import DestacadosSection from "../components/DestacadosSection";

import "../styles/home.css";

function Home() {

  return (
    <>
      <section className="main-section">
        <div className="main-overlay">
          <div className="promo-content">
            <img
              src="/images/logo-nb.PNG"
              alt="Logo de Materiales SADA"
              className="promo-image"
            />
            <h1>MATERIALES SADA</h1>
            <p>Tu aliado de construcción local en el sur de Veracruz.</p>
            <a href="/productos" className="promo-button">
              Conoce nuestros productos
            </a>
          </div>
        </div>
      </section>
      <DestacadosSection />
    </>
  );
}

export default Home;
