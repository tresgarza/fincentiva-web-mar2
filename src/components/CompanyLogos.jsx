import { companyLogos } from "../constants";

const CompanyLogos = ({ className }) => {
  return (
    <div className={className}>
      <h5 className="tagline mb-6 text-center text-n-1/50">
        Financiamiento disponible para las empresas aliadas a Fincentiva
      </h5>
      <div className="flex justify-center gap-8">
        {/* Aquí irían los logos de las empresas aliadas */}
      </div>
    </div>
  );
};

export default CompanyLogos;
