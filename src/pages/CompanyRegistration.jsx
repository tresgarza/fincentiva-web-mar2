import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabaseClient';
import Section from '../components/Section';
import Button from '../components/Button';
import { BsArrowRight, BsWhatsapp } from 'react-icons/bs';

const CompanyRegistration = () => {
  const [formData, setFormData] = useState({
    contactName: '',
    position: '',
    email: '',
    phone: '',
    companyName: '',
    companySize: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // Guardar en Supabase
      const { error: supabaseError } = await supabase
        .from('company_registrations')
        .insert([
          {
            contact_name: formData.contactName,
            position: formData.position,
            email: formData.email,
            phone: formData.phone,
            company_name: formData.companyName,
            company_size: formData.companySize
          }
        ]);

      if (supabaseError) throw supabaseError;

      setSuccess(true);

      // Crear mensaje para WhatsApp
      const whatsappMessage = encodeURIComponent(
        `¡Hola! Me interesa registrar mi empresa en Fincentiva.\n\n` +
        `*Datos de contacto:*\n` +
        `Nombre: ${formData.contactName}\n` +
        `Puesto: ${formData.position}\n` +
        `Email: ${formData.email}\n` +
        `Teléfono: ${formData.phone}\n\n` +
        `*Datos de la empresa:*\n` +
        `Nombre: ${formData.companyName}\n` +
        `Tamaño: ${formData.companySize} empleados`
      );

      // Esperar 3 segundos antes de redireccionar
      setTimeout(() => {
        window.open(`https://wa.me/528116364522?text=${whatsappMessage}`, '_blank');
      }, 3000);

    } catch (error) {
      setError('Hubo un error al procesar tu registro. Por favor intenta nuevamente.');
      console.error('Error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const fadeInUpVariant = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="pt-[4.75rem] lg:pt-[5.25rem] overflow-hidden">
      <Section className="mt-[2rem]">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            visible: {
              transition: {
                staggerChildren: 0.1
              }
            }
          }}
          className="container max-w-[800px]">
          
          <motion.div variants={fadeInUpVariant} className="text-center mb-12">
            <h1 className="h1 mb-6">Registro Empresarial</h1>
            <p className="body-1 text-n-4">
              Comienza a ofrecer beneficios financieros a tus empleados
            </p>
          </motion.div>

          <motion.form
            variants={fadeInUpVariant}
            onSubmit={handleSubmit}
            className="bg-n-8 rounded-2xl p-8 md:p-12 border border-n-6">
            
            <div className="space-y-8">
              {/* Datos de Contacto */}
              <div>
                <h3 className="h4 mb-6">Datos de Contacto</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-n-4 mb-2" htmlFor="contactName">
                      Nombre Completo *
                    </label>
                    <input
                      required
                      type="text"
                      id="contactName"
                      name="contactName"
                      value={formData.contactName}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-n-7 rounded-xl border border-n-6 focus:outline-none focus:border-color-1"
                      placeholder="Tu nombre"
                    />
                  </div>
                  <div>
                    <label className="block text-n-4 mb-2" htmlFor="position">
                      Puesto *
                    </label>
                    <input
                      required
                      type="text"
                      id="position"
                      name="position"
                      value={formData.position}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-n-7 rounded-xl border border-n-6 focus:outline-none focus:border-color-1"
                      placeholder="Tu puesto en la empresa"
                    />
                  </div>
                  <div>
                    <label className="block text-n-4 mb-2" htmlFor="email">
                      Correo Electrónico *
                    </label>
                    <input
                      required
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-n-7 rounded-xl border border-n-6 focus:outline-none focus:border-color-1"
                      placeholder="tu@empresa.com"
                    />
                  </div>
                  <div>
                    <label className="block text-n-4 mb-2" htmlFor="phone">
                      Teléfono *
                    </label>
                    <input
                      required
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-n-7 rounded-xl border border-n-6 focus:outline-none focus:border-color-1"
                      placeholder="Tu número de teléfono"
                    />
                  </div>
                </div>
              </div>

              {/* Datos de la Empresa */}
              <div>
                <h3 className="h4 mb-6">Datos de la Empresa</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-n-4 mb-2" htmlFor="companyName">
                      Nombre de la Empresa *
                    </label>
                    <input
                      required
                      type="text"
                      id="companyName"
                      name="companyName"
                      value={formData.companyName}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-n-7 rounded-xl border border-n-6 focus:outline-none focus:border-color-1"
                      placeholder="Nombre de tu empresa"
                    />
                  </div>
                  <div>
                    <label className="block text-n-4 mb-2" htmlFor="companySize">
                      Número de Empleados *
                    </label>
                    <select
                      required
                      id="companySize"
                      name="companySize"
                      value={formData.companySize}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-n-7 rounded-xl border border-n-6 focus:outline-none focus:border-color-1"
                    >
                      <option value="">Selecciona un rango</option>
                      <option value="1-10">1-10 empleados</option>
                      <option value="11-50">11-50 empleados</option>
                      <option value="51-200">51-200 empleados</option>
                      <option value="201-500">201-500 empleados</option>
                      <option value="501+">Más de 500 empleados</option>
                    </select>
                  </div>
                </div>
              </div>

              {error && (
                <div className="text-red-500 text-center p-4 bg-red-500/10 rounded-xl">
                  {error}
                </div>
              )}

              {success && (
                <div className="text-green-500 text-center p-4 bg-green-500/10 rounded-xl">
                  <p className="mb-2">¡Registro exitoso!</p>
                  <p className="text-sm">En unos segundos te redirigiremos a WhatsApp para continuar con el proceso...</p>
                </div>
              )}

              <div className="flex justify-center">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="min-w-[200px] group"
                >
                  <span className="flex items-center gap-2">
                    {isSubmitting ? 'Procesando...' : 'Registrar Empresa'}
                    {!isSubmitting && (
                      <BsWhatsapp className="text-xl transition-transform group-hover:translate-x-1" />
                    )}
                  </span>
                </Button>
              </div>
            </div>
          </motion.form>
        </motion.div>
      </Section>
    </div>
  );
};

export default CompanyRegistration; 