import React, {
  useState,
  useEffect,
  type ChangeEvent,
  type FormEvent
} from 'react';

import {
  MapPin,
  Heart,
  Send,
  CheckCircle,
  AlertCircle,
  X,
  Gift,
  Camera,
  Wallet,
  Phone
} from 'lucide-react';
// ============================================
// TIPOS E INTERFACES
// ============================================

interface CountdownState {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

interface FormData {
  nombre: string;
  telefono: string;
  asistencia: string;
  alergias: string;
  dietaEspecial: string;
  mensaje: string;
}

interface FormStatus {
  loading: boolean;
  success: boolean;
  error: boolean;
  message: string;
}

interface CountdownItem {
  value: number;
  label: string;
}


interface DataToSend extends FormData {
  fecha: string;
  timestamp: string;
}

// ============================================
// COMPONENTE PRINCIPAL
// ============================================

export default function App(): React.JSX.Element {
  // ============================================
  // ESTADOS
  // ============================================

  // Estado para la pantalla de carga
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [loadingProgress, setLoadingProgress] = useState<number>(0);

  // Estado para la pantalla de bienvenida
  const [showSplash, setShowSplash] = useState<boolean>(true);
  const [fadeOut, setFadeOut] = useState<boolean>(false);

  // Estado para el video
  const [playVideo, setPlayVideo] = useState<boolean>(false);
  const [videoEnded, setVideoEnded] = useState<boolean>(false);

  // Estado para el modal del formulario RSVP
  const [showRSVPModal, setShowRSVPModal] = useState<boolean>(false);

  const [countdown, setCountdown] = useState<CountdownState>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

// Estado inicial alineado a tu setFormData
const initialFormState: FormData = {
  nombre: '',
  telefono: '',
  asistencia: 'si',
  alergias: '',
  dietaEspecial: 'ninguna',
  mensaje: ''
};
  const [formStatus, setFormStatus] = useState<FormStatus>({
    loading: false,
    success: false,
    error: false,
    message: ''
  });


const [formData, setFormData] = useState<FormData>(initialFormState);

  // Estado para detectar el tamaño de pantalla
  const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth < 768);

  // Estado para controlar si la sección de fecha está visible
  const [dateTimeVisible, setDateTimeVisible] = useState<boolean>(false);

  // Estado para controlar si la sección de precios está visible
  const [pricesVisible, setPricesVisible] = useState<boolean>(false);

  // Estado para controlar si la sección de código de vestimenta está visible
  const [dressCodeVisible, setDressCodeVisible] = useState<boolean>(false);

  // Estado para controlar si la sección de regalos está visible
  const [giftsVisible, setGiftsVisible] = useState<boolean>(false);

  // Estado para el carousel de fotos - Mobile
  const [currentSlide, setCurrentSlide] = useState<number>(0);


  // Estado para la sección de fotos

  const [photosVisible, setPhotosVisible] = useState(false);

  // ============================================
  // CONFIGURACIÓN
  // ============================================

 const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxuEjXo-X8AaB5apZ8OqekpveC0p75JM0yUbVgrjVvqiZT22a_FJrSXeZmgj-Xjb6VYTQ/exec';
  const weddingDate: Date = new Date(2027, 1, 6, 18, 30, 0);

  // URLs - Video local de la pareja


  // Imágenes del carousel
  const carouselImages: string[] = [
    '/DSC_5804.JPG',
    '/DSC_6837.JPG',
    '/DSC_6256.JPG',
    '/DSC_5675.JPG',
    '/DSC_6644.JPG',
    '/DSC_7149.JPG',
    '/DSC_6817.JPG',
  ];

  const novios: string = "Flor & Yoel";


  // ============================================
  // EFECTOS
  // ============================================

  const [cierreVisible, setCierreVisible] = useState(false);

useEffect(() => {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setCierreVisible(true);
        }
      });
    },
    { threshold: 0.2 }
  );

  const element = document.getElementById('cierre');
  if (element) observer.observe(element);

  return () => observer.disconnect();
}, []);

  // Countdown timer
  useEffect(() => {
    const updateCountdown = (): void => {
      const now: number = new Date().getTime();
      const distance: number = weddingDate.getTime() - now;

      if (distance < 0) {
        setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const days: number = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours: number = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes: number = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds: number = Math.floor((distance % (1000 * 60)) / 1000);

      setCountdown({ days, hours, minutes, seconds });
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  // Detectar cambios de tamaño de ventana para responsive background
  useEffect(() => {
    const handleResize = (): void => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Intersection Observer para detectar cuando la sección de fecha está visible
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setDateTimeVisible(true);
          }
        });
      },
      { threshold: 0.2 }
    );

    const dateTimeSection = document.getElementById('date-time');
    if (dateTimeSection) {
      observer.observe(dateTimeSection);
    }

    return () => {
      if (dateTimeSection) {
        observer.unobserve(dateTimeSection);
      }
    };
  }, [videoEnded]);

  // Intersection Observer para la sección de precios
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setPricesVisible(true);
          }
        });
      },
      { threshold: 0.2 }
    );

    const pricesSection = document.getElementById('prices-section');
    if (pricesSection) {
      observer.observe(pricesSection);
    }

    return () => {
      if (pricesSection) {
        observer.unobserve(pricesSection);
      }
    };
  }, [videoEnded]);

  // Intersection Observer para la sección de código de vestimenta
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setDressCodeVisible(true);
          }
        });
      },
      { threshold: 0.2 }
    );

    const dressCodeSection = document.getElementById('dress-code');
    if (dressCodeSection) {
      observer.observe(dressCodeSection);
    }

    return () => {
      if (dressCodeSection) {
        observer.unobserve(dressCodeSection);
      }
    };
  }, [videoEnded]);

  // Intersection Observer para la sección de regalos
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setGiftsVisible(true);
          }
        });
      },
      { threshold: 0.2 }
    );

    const giftsSection = document.getElementById('gifts-section');
    if (giftsSection) {
      observer.observe(giftsSection);
    }

    return () => {
      if (giftsSection) {
        observer.unobserve(giftsSection);
      }
    };
  }, [videoEnded]);

  // Autoplay para el carousel mobile (cambio automático cada 5 segundos)
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
    }, 5000); // 5 segundos

    return () => clearInterval(interval);
  }, [carouselImages.length]);


  // Intersection Observer para la sección de fotos

useEffect(() => {
  const observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        setPhotosVisible(true);
        observer.disconnect();
      }
    },
    { threshold: 0.2 }
  );

  const section = document.getElementById('photos-section');

  if (section) {
    observer.observe(section);
  }

  return () => observer.disconnect();
}, []);

  // Intersection para la imagen central


useEffect(() => {
  const splashImage = new Image();
  splashImage.src = '/DSC_6050.JPG';

  const finishLoading = () => {
    setLoadingProgress(100);

    setTimeout(() => {
      setIsLoading(false);
    }, 300);
  };

  splashImage.onload = finishLoading;
  splashImage.onerror = finishLoading;

  return () => {
    splashImage.onload = null;
    splashImage.onerror = null;
  };
}, []);
  // ============================================
  // FUNCIONES
  // ============================================

  const [dividerVisible, setDividerVisible] = useState(false);

useEffect(() => {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setDividerVisible(true);
        }
      });
    },
    { threshold: 0.2 }
  );

  const element = document.getElementById('divider-flores');
  if (element) observer.observe(element);

  return () => observer.disconnect();
}, []);

  const handleSplashClick = (): void => {
    setFadeOut(true);
    setTimeout(() => {
      setShowSplash(false);
      setPlayVideo(true);
    }, 800); // Espera a que termine la animación
  };

  const handleVideoEnd = (): void => {
    setVideoEnded(true);
  };

  const openRSVPModal = (): void => {
    setShowRSVPModal(true);
    document.body.style.overflow = 'hidden'; // Prevenir scroll del body
  };

  const closeRSVPModal = (): void => {
    setShowRSVPModal(false);
    document.body.style.overflow = 'unset';
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>): void => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };


const handleSubmit = async (
  e: FormEvent<HTMLFormElement>
): Promise<void> => {
  e.preventDefault();

  if (!formData.nombre.trim()) {
    setFormStatus({
      loading: false,
      success: false,
      error: true,
      message: 'Por favor, completá los nombres de los asistentes.'
    });
    return;
  }

  setFormStatus({
    loading: true,
    success: false,
    error: false,
    message: 'Enviando tu respuesta...'
  });

  try {
    const dataToSend: DataToSend = {
      ...formData,
      fecha: new Date().toLocaleString('es-AR', {
        timeZone: 'America/Argentina/Buenos_Aires'
      }),
      timestamp: new Date().toISOString()
    };

    await fetch(GOOGLE_SCRIPT_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8'
      },
      body: JSON.stringify(dataToSend)
    });

    setFormStatus({
      loading: false,
      success: true,
      error: false,
      message: '¡Gracias! Tu confirmación fue enviada exitosamente 🎉'
    });

    setFormData(initialFormState);

    setTimeout(() => {
      setFormStatus({
        loading: false,
        success: false,
        error: false,
        message: ''
      });

      closeRSVPModal();
    }, 3000);

  } catch (error) {
    console.error('Error al enviar:', error);

    setFormStatus({
      loading: false,
      success: false,
      error: true,
      message: 'No se pudo conectar con el formulario.'
    });
  }
};

  // Datos del countdown
  const countdownItems: CountdownItem[] = [
    { value: countdown.days, label: 'Días' },
    { value: countdown.hours, label: 'Horas' },
    { value: countdown.minutes, label: 'Minutos' },
    { value: countdown.seconds, label: 'Segundos' }
  ];


  return (
    <div className="min-h-screen bg-gradient-to-br from-silver-mist to-cream-beige">
      {/* ============================================ */}
      {/* LOADING SCREEN - Pantalla de Carga */}
      {/* ============================================ */}
      {isLoading && (
        <div className="fixed inset-0 z-[150] bg-gradient-to-br from-warm-taupe to-dark-espresso flex flex-col items-center justify-center">
          <div className="text-center px-4 space-y-8">
            {/* Título de la invitación */}
            <h1 className="font-serif italic text-4xl md:text-6xl text-cream-beige mb-4 animate-pulse">
              {novios}
            </h1>

            {/* Mensaje de carga */}
            <p className="text-lg md:text-xl text-silver-mist mb-8">
              Cargando invitación...
            </p>

            {/* Barra de progreso */}
            <div className="w-64 md:w-80 mx-auto">
              <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                <div
                  className="h-full bg-cream-beige transition-all duration-500 ease-out rounded-full"
                  style={{ width: `${loadingProgress}%` }}
                />
              </div>
              <p className="text-sm text-silver-mist mt-3">
                {Math.round(loadingProgress)}%
              </p>
            </div>

            {/* Icono de corazón animado */}
            <div className="mt-8">
              <Heart className="w-12 h-12 mx-auto text-cream-beige animate-pulse" />
            </div>
          </div>
        </div>
      )}

      {/* ============================================ */}
      {/* SPLASH SCREEN - Pantalla de Bienvenida */}
      {/* ============================================ */}
      {!isLoading && showSplash && (
        <div
          onClick={handleSplashClick}
          className={`fixed inset-0 z-[100] bg-cover bg-center flex items-center justify-center cursor-pointer transition-opacity duration-800 ${
            fadeOut ? 'opacity-0' : 'opacity-100'
          }`}
          style={{
            backgroundImage: `radial-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url('/DSC_5798.JPG')`
          }}
        >
          <div className="text-center px-4 animate-fade-in">
            <div className="mb-8">
            </div>
            <h1 className="font-serif italic text-5xl md:text-7xl text-cream-beige mb-6">
               {novios}
            </h1>
            <p className=" font-['Lora'] text-xl md:text-2xl text-white mb-8">
              Nos casamos
            </p>
            <p className=" font-['Lora'] text-lg md:text-xl text-silver-mist mb-12">
              6 de Febrero, 2027
            </p>
           <p className="bg-white/20 backdrop-blur-md font-['Lora'] text-sm md:text-base text-silver-mist animate-bounce rounded-full px-6 py-2">
       Toca para continuar
          </p>
          </div>
        </div>
      )}

      

      {/* ============================================ */}
      {/* CONTENIDO PRINCIPAL (visible después del video) */}
      {/* ============================================ */}
<div className={`transition-opacity duration-1000 ${showSplash ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
        {/* ============================================ */}
        {/* HERO SECTION - Imagen de fondo + Countdown + Botón RSVP */}
        {/* ============================================ */}
    <section
  className="min-h-screen flex items-center justify-center relative overflow-hidden"
>
  {/* Imagen de fondo */}
  <div
    className="absolute inset-0 bg-cover bg-center"
    style={{
      backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('/DSC_6050.JPG')`,
    }}
  />

 

  <div className="container mx-auto px-4 text-center text-white relative z-10">
    <div className="text-3xl md:text-4xl mb-6 font-serif italic text-amber-200">
     Nos Casamos
    </div>

    <div className="font-serif italic text-5xl md:text-7xl my-8">
     {novios}
    </div>

    <p className= "font-['Lora'] text-xl md:text-2xl mb-2" > Sábado 06 de Febrero 2027</p>
    <p className="text-lg md:text-xl mb-12"></p>

    {/* Countdown */}
    <div className="flex justify-center gap-4 md:gap-8 flex-wrap mb-12">
      {countdownItems.map((item, index) => (
        <div key={index} className={`bg-white/20 backdrop-blur-md rounded-xl p-4 md:p-6 min-w-[80px] md:min-w-[100px] ${item.label === 'Segundos' ? 'hidden md:flex md:flex-col' : ''}`}>
          <div className="text-3xl md:text-5xl font-bold">
            {String(item.value).padStart(2, '0')}
          </div>
          <div className="text-sm md:text-base mt-2">{item.label}</div>
        </div>
      ))}
    </div>

    {/* Botón RSVP Principal */}
       <button
      onClick={openRSVPModal}
      className="group relative inline-flex items-center justify-center gap-3 bg-warm-taupe hover:bg-dark-espresso text-white px-12 py-5 rounded-full text-xl !font-['Lora'] transition-all duration-300 hover:scale-110 shadow-2xl hover:shadow-gray/50"
    >
      Confirmá acá tu asistencia
    </button>

  </div>
</section>

        {/* ============================================ */}
        {/* SECCIONES ADICIONALES */}
        {/* ============================================ */}

{/* Invitation Text */}
{/* Invitation Text */}
<section
  className="py-16 md:py-24"
  style={{ backgroundColor: 'rgb(251, 248, 242)' }}
>
  <div className="container mx-auto px-4">
    <div className="max-w-3xl mx-auto text-center text-dark-espresso space-y-4 font-['Lora']">
      <p className="text-lg md:text-2xl">Queremos compartir con vos</p>
      <p className="text-lg md:text-2xl">uno de los días más importantes de nuestras vidas.</p>
    </div>
  </div>
</section>
       {/* Date & Time Section */}
<section
  className="py-12 md:py-24 relative overflow-hidden"
  id="date-time"
>
  {/* Capa 1: Fondo base con posición optimizada para móvil y desktop */}
  <div
    className="absolute inset-0 bg-cover bg-[position:35%_center] md:bg-center bg-scroll md:bg-fixed"
    style={{
      backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.55), rgba(255, 255, 255, 0.55)), url('DSC_6544.JPG')`
    }}
  />

  {/* Capa 2: Animación superpuesta sin zoom agresivo en mobile */}
  <div
    className="absolute inset-0 bg-cover bg-center sm:animate-subtle-zoom opacity-60 pointer-events-none"
    style={{
      backgroundImage: `url('DSC_605.JPG')`
    }}
  />

  <div className="container mx-auto px-4 relative z-10">
    <h2 className={`font-serif italic text-4xl md:text-6xl text-center text-dark-espresso mb-12 ${dateTimeVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>
      Fecha y Hora
    </h2>

    <div className={`max-w-2xl mx-auto bg-white/30 backdrop-blur-md shadow-2xl p-6 sm:p-8 md:p-12 rounded-2xl ${dateTimeVisible ? 'animate-fade-in-up-delayed' : 'opacity-0'}`}>
      <div className="text-center space-y-6">
        <div className={`font-['Lora'] text-xl md:text-2xl text-dark-espresso font-semibold ${dateTimeVisible ? 'animate-fade-in-content' : 'opacity-0'}`}>SÁBADO</div>
        <div className={`font-['Lora'] text-6xl md:text-8xl font-bold text-warm-taupe ${dateTimeVisible ? 'animate-scale-in-content' : 'opacity-0'}`}>06</div>
        <div className={`font-['Lora'] text-xl md:text-2xl text-dark-espresso font-semibold ${dateTimeVisible ? 'animate-fade-in-content' : 'opacity-0'}`}>Febrero 2027</div>

        <div className="my-8 flex justify-center">
          <div className={`border-t-2 border-gray-sage transition-all duration-700 ${dateTimeVisible ? 'w-full max-w-xs' : 'w-0'}`} />
        </div>

        <div className="space-y-6">
          <div className={dateTimeVisible ? 'animate-fade-in-content-slow' : 'opacity-0'}>
            <p className="font-['Lora'] text-xl text-dark-espresso mb-1">Recepción:</p>
            <p className="font-['Lora'] text-3xl md:text-4xl text-warm-taupe">18:30</p>
          </div>
          
          <div className={dateTimeVisible ? 'animate-fade-in-content-slower' : 'opacity-0'}>
            <p className="font-['Lora'] text-xl text-dark-espresso mb-1">Ceremonia:</p>
            <p className="font-['Lora'] text-3xl md:text-4xl text-warm-taupe">19:00</p>
          </div>

          <div className={dateTimeVisible ? 'animate-fade-in-content-slow' : 'opacity-0'}>
            <p className="font-['Lora'] text-xl text-dark-espresso mb-1">Cena:</p>
            <p className="font-['Lora'] text-3xl md:text-4xl text-warm-taupe">20:30</p>
          </div>

          <div className={dateTimeVisible ? 'animate-fade-in-content-slow' : 'opacity-0'}>
            <p className="font-['Lora'] text-xl text-dark-espresso mb-1">Despedida:</p>
            <p className="font-['Lora'] text-3xl md:text-4xl text-warm-taupe">01:00</p>
          </div>
        </div>

        <div className="font-['Lora'] italic text-dark-espresso pt-4 text-sm md:text-base">
          ¡Vení temprano! El horario del civil es estricto e improrrogable.
        </div>
      </div>
    </div>
  </div>
</section>
        {/* Invitation Text 
        
       

De Norte a Sur, Dios trazó nuestros caminos hasta hacerlos coincidir en el centro.

Hoy, unidos por el amor y guiados por la fe, elegimos comenzar juntos una nueva etapa y compartir la vida que Dios nos permitió encontrar el uno en el otro.

Con mucha alegría, queremos celebrar este día junto a quienes amamos y son parte de nuestra historia.
        
        */}
       <section
  className="py-16 md:py-24"
  style={{ backgroundColor: 'rgb(251, 248, 242)' }}
>
  <div className="container mx-auto px-4">
    <div className="max-w-3xl mx-auto text-center text-dark-espresso space-y-4">
     <p className="font-serif italic text-xl md:text-3xl">
  “Sobre todo revístanse de amor, que es el lazo de la perfecta unión.”
  Colosenses 3:14
</p>
  <br></br>
   <p className="text-base md:text-xl  font-['Lora'] ">De norte a sur, Dios trazó nuestros caminos hasta hacerlos coincidir en el centro del país.</p>
<p className="text-base md:text-xl  font-['Lora'] ">Hoy, unidos por el amor y guiados por la fe, elegimos comenzar juntos una nueva etapa y compartir la vida que Dios nos permitió encontrar el uno en el otro.</p>
<p className="text-base md:text-xl  font-['Lora'] ">Con mucha alegría, queremos celebrar este día junto a quienes amamos y son parte de nuestra historia.</p>
    </div>
  </div>
</section>

        {/* Location Section */}
        <section
          className="py-16 md:py-24 relative bg-cover bg-center overflow-hidden"
          style={{
            backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.5), rgba(255, 255, 255, 0.5)), url('DSC_6626.JPG')`
          }}
          id="date-time"
          >
         
        {/* Animación de parallax sutil en el fondo */}
          <div
            className="absolute inset-0 bg-cover bg-center animate-subtle-zoom"
            style={{
              backgroundImage: `, url('DSC_6626.JPG')`,
              opacity: 0.7
            }}
          />

          <div className="container mx-auto px-4 relative z-10">
            <h2 className={`font-serif italic text-4xl md:text-6xl text-center text-dark-espresso mb-12 ${dateTimeVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>
              Ubicación
            </h2>

            <div className={`max-w-2xl mx-auto bg-white/40 backdrop-blur-sm shadow-2xl p-8 md:p-12 rounded-2xl ${dateTimeVisible ? 'animate-fade-in-up-delayed' : 'opacity-0'}`}>
              <div className="text-center space-y-6">
                <div className={`text-xl md:text-2xl text-dark-espresso ${dateTimeVisible ? 'animate-fade-in-content' : 'opacity-0'}`}> 
                <h3 className="text-2xl md:text-3xl font-['Lora'] font-semibold text-warm-taupe text-center mb-4">
                SAINT GEORGE VILLAGE
              </h3></div>
                <div className={`text-6xl md:text-8xl font-bold text-warm-taupe ${dateTimeVisible ? 'animate-scale-in-content' : 'opacity-0'}`}> </div>
                <div className={`text-xl md:text-2xl text-dark-espresso ${dateTimeVisible ? 'animate-fade-in-content' : 'opacity-0'}`}> </div>

                <div className="my-8 flex justify-center">
                  <div className={`border-t-2 border-gray-sage ${dateTimeVisible ? 'animate-expand-width' : 'w-0'}`} />
                </div>

                <div className="space-y-6">
                  <div className={dateTimeVisible ? 'animate-fade-in-content-slow' : 'opacity-0'}>
                <p className="text-center text-gray-sage mb-8 font-['Lora']  ">
                Autopista 19 km 7 (Altura Fábrica Bimbo)<br />
                Córdoba, Argentina 
              </p>
                  </div>

                 <div className={dateTimeVisible ? 'animate-fade-in-content-slower' : 'opacity-0'}>
  <iframe
    src="https://www.google.com/maps?q=-31.3914333,-64.0463448&output=embed"
    width="100%"
    height="350"
    style={{ border: 0 }}
    allowFullScreen
    loading="lazy"
    className="w-full"
    title="Ubicación del evento"
  />
</div>
                </div>

                <a
                href="https://maps.app.goo.gl/m7X3zUsHA4Qv4tZr9"
                target="_blank"
                rel="noopener noreferrer"
                className="font-['Lora'] flex items-center justify-center gap-2 bg-warm-taupe hover:bg-dark-espresso text-white px-8 py-4 rounded-full text-lg font-medium transition-all hover:scale-105 shadow-lg w-full"
              >
                <MapPin className="w-5 h-5 " />
                Abrir en Google Maps
              </a>
              </div>
            </div>
          </div>
        </section>


                {/* Price Section  */}
        <section className="py-16 md:py-24" id="prices-section" 
  style={{ backgroundColor: 'rgb(251, 248, 242)' }}>
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <Wallet className={`w-12 h-12 mx-auto text-warm-taupe mb-4 ${pricesVisible ? 'animate-fade-in' : 'opacity-0'}`} />
              <h2 className={`font-serif italic text-4xl md:text-6xl text-dark-espresso mb-8 ${pricesVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>
               Valor de las Tarjetas
              </h2>

              <div className={`bg-white rounded-2xl shadow-xl p-8 md:p-12 ${pricesVisible ? 'animate-fade-in-up-delayed' : 'opacity-0'}`}>
                {/* Contenedor de las dos listas de precios */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
                  {/* Lista de precios para s */}
                  <div>
                    <p className="text-2x1 font-semibold font-medium text-dark-espresso mb-4 font-serif">ADULTOS</p>
                    <ul className="text-gray-sage text-lg">
                      <li className="mb-4 font-['Lora']">Septiembre 2026 - Octubre 2026: $105.000</li>
                      <li className="mb-4 font-['Lora']">Noviembre 2026 - Diciembre 2026: $110.000</li>
                      <li className="mb-4 font-['Lora']">Enero 2027: $120.000</li>
                    </ul>
                  </div>

                  {/* Lista de precios para Menores */}
                  <div>
                    <p className="text-2x1 font-semibold font-['Lora'] font-medium text-dark-espresso mb-4 font-serif">MENORES (3 A 10 AÑOS)</p>
                    <ul className="text-gray-sage text-lg">
                      <li className="mb-4 font-serif">Septiembre 2026 - Octubre 2026: $55.000</li>
                      <li className="mb-4 font-serif">Noviembre 2026 - Diciembre 2026: $58.000</li>
                      <li className="mb-4 font-serif">Enero 2027: $62.000</li>
                    </ul>
                  </div>
                </div>

              

                <div className="space-y-6">
                  <div className="bg-cream-beige/20 rounded-xl p-6">
                    <h3 className="text-xl font-semibold text-warm-taupe mb-3 font-serif">Datos para las transferencias:</h3>
                    <p className="text-gray-sage">
                      
                      <p className="font-['Lora'] "></p>
 
                      <p className="text-gray-sage font-['Lora']">
    <span>Alias:</span> <span className="font-bold">BODA.FLOR.YOEL</span><br />
    <span>CBU:</span> <span className="font-bold">4530000800015854237742</span><br />
    <span>Banco:</span> <span className="font-bold">Naranja X</span><br />
    <span>Titular:</span> <span className="font-bold">Erick Yoel Calpanchay</span>
  </p>        <br></br>
                     <span className="font-['Lora']"> Por favor, verificar los datos antes de realizar la transferencia.</span>
                      
                    </p>
                  </div>
                </div>
                <div className="mt-8 p-4 bg-warm-taupe/10 rounded-lg">

                </div>
              </div>
            </div>
          </div>
        </section>


{/* Photo Gallery Section - Carousel */}
<section
  className="py-8 md:py-16"
  id="photo-gallery" 
  style={{ backgroundColor: 'rgb(251, 248, 242)' }}
>
  <div className="w-full">
    <div className="text-center mb-8 md:mb-12 px-4">
      <h2 className="font-serif italic text-3xl md:text-5xl text-dark-espresso mb-4">
        Un nuevo capítulo comienza.
      </h2>
      <p className="font-['Lora'] text-gray-sage text-lg">Sé testigo del inicio de nuestro viaje</p>
    </div>

    {/* Carousel Container */}
    <div className="relative w-full">
      
      {/* Mobile Carousel (Proporción vertical, para fotos verticales) */}
      <div className="md:hidden w-full px-4">
        <div className="relative aspect-[3/4] w-full mx-auto overflow-hidden shadow-2xl rounded-2xl">
          {carouselImages.map((image, index) => (
            <div
              key={index}
              className={`absolute inset-0 w-full h-full transition-all duration-1000 ease-in-out ${
                index === currentSlide
                  ? 'opacity-100 scale-100'
                  : 'opacity-0 scale-105'
              }`}
            >
              <img
                src={image}
                alt={`Foto ${index + 1}`}
                className="w-full h-full object-cover object-center"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Desktop: Infinite scroll carousel */}
      <div className="hidden md:block h-[75vh] relative overflow-hidden">
        <div className="infinite-scroll-container">
          {/* Primera serie de imágenes */}
          {carouselImages.map((image, index) => (
            <div
              key={`first-${index}`}
              className="infinite-scroll-item group bg-gradient-to-br from-gray-100 to-gray-200"
            >
              <img
                src={image}
                alt={`Foto ${index + 1}`}
                className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300" />
            </div>
          ))}
          {/* Segunda serie de imágenes (duplicado) */}
          {carouselImages.map((image, index) => (
            <div
              key={`second-${index}`}
              className="infinite-scroll-item group bg-gradient-to-br from-gray-100 to-gray-200"
            >
              <img
                src={image}
                alt={`Foto ${index + 1}`}
                className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300" />
            </div>
          ))}
        </div>
      </div>

    </div>
  </div>
</section>


        

       {/* Dress Code Section */}
<section
  className="py-16 md:py-24 relative bg-cover bg-center overflow-hidden"
  style={{
    backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.5), rgba(255, 255, 255, 0.5)),  url('/DSC_6077.JPG')`
  }}
  id="dress-code"
>
  {/* Animación de parallax sutil en el fondo 
  <div
    className="absolute inset-0 bg-cover bg-center animate-subtle-zoom"
    style={{
      backgroundImage: `url('/DSC_6931.JPG')`,
      opacity: 0.5
    }}
  />*/}

  <div className="container mx-auto px-4 relative z-10">
    <h2 className={`font-serif italic text-4xl md:text-6xl text-center text-dark-espresso mb-12 ${dressCodeVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>
      Código de Vestimenta
    </h2>

    <div className={`max-w-2xl mx-auto bg-white/30 backdrop-blur-sm shadow-2xl p-8 md:p-12 rounded-2xl ${dressCodeVisible ? 'animate-fade-in-up-delayed' : 'opacity-0'}`}>
      <div className="text-center space-y-6">
        <div className={`font-['Lora'] text-2xl md:text-3xl font-semibold text-warm-taupe ${dressCodeVisible ? 'animate-fade-in-content' : 'opacity-0'}`}> Formal
          
        </div>

        <div className="my-8 flex justify-center">
          <div className={`border-t-2 border-gray-sage ${dressCodeVisible ? 'animate-expand-width' : 'w-0'}`} />
        </div>

        <p className={`font-['Lora'] text-lg text-dark-espresso ${dressCodeVisible ? 'animate-fade-in-content-slow' : 'opacity-0'}`}>
         Para acompañarnos en este día tan especial, únicamente les pedimos a nuestras invitadas evitar el color blanco o tonalidades similares, reservadas para la novia.
        </p>
      </div>
    </div>
  </div>
</section>

    
        {/* Gifts Section */}
        <section className="py-16 md:py-24" id="gifts-section" style={{ backgroundColor: 'rgb(251, 248, 242)' }}>
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <Gift className={`w-12 h-12 mx-auto text-warm-taupe mb-4 ${giftsVisible ? 'animate-fade-in' : 'opacity-0'}`} />
              <h2 className={`font-serif italic text-4xl md:text-6xl text-dark-espresso mb-8 ${giftsVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>
                Regalos
              </h2>

              <div className={`bg-white rounded-2xl shadow-xl p-8 md:p-12 ${giftsVisible ? 'animate-fade-in-up-delayed' : 'opacity-0'}`}>
                <div className="space-y-6">
                  <p className={` font-['Lora'] text-lg md:text-xl text-dark-espresso ${giftsVisible ? 'animate-fade-in-content' : 'opacity-0'}`}>
                    Gracias a Dios, ya tenemos todo lo necesario para nuestro hogar.
                  </p>

                  <div className={` font-['Lora'] text-base md:text-lg text-gray-sage ${giftsVisible ? 'animate-fade-in-content-slow' : 'opacity-0'}`}>
                    <p className="mb-4">
                      Pero si aun asi deseas hacernos un obsequio, puedes hacerlo mediante una transferencia. Lo recibiremos con mucho cariño!
                    </p>
                  </div>

                  <div className="my-8 flex justify-center">
                    <div className={`border-t-2 border-gray-sage ${giftsVisible ? 'animate-expand-width' : 'w-0'}`} />
                  </div>

                <div className={`bg-cream-beige/20 rounded-xl p-6 ${giftsVisible ? 'animate-fade-in-content-slower' : 'opacity-0'}`}>
  <h3 className="font-['Lora'] text-xl font-semibold text-warm-taupe mb-3">Datos para transferencias</h3>
  <p className="text-gray-sage font-['Lora']">
    <span>Alias:</span> <span className="font-bold">BODA.FLOR.YOEL</span><br />
    <span>CBU:</span> <span className="font-bold">4530000800015854237742</span><br />
    <span>Banco:</span> <span className="font-bold">Naranja X</span><br />
    <span>Titular:</span> <span className="font-bold">Erick Yoel Calpanchay</span>
  </p>
</div>

                {/*  <div className={`mt-8 ${giftsVisible ? 'animate-fade-in-button' : 'opacity-0'}`}>
                    <a
                      href="https://docs.google.com/document/d/1J_pUsa5ua8Zidid2AEv3gPAqq3zKy0vypBNAF58iTjk/edit?tab=t.0"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 bg-warm-taupe hover:bg-dark-espresso text-white px-8 py-4 rounded-full text-lg font-medium transition-all hover:scale-105 shadow-lg w-full"
                    >
                      <Gift className="w-5 h-5" />
                      Ver Lista de Regalos
                    </a>
                  </div>*/}
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* Separador decorativo floral */}
<div
  id="divider-flores"
  className="flex justify-center pt-6 pb-0 md:pt-10 md:pb-0"
  style={{ backgroundColor: 'rgb(251, 248, 242)' }}
>
  <img
    src="/jeje.png"
    alt=""
    className={`w-80 md:w-[32rem] max-w-full transition-all duration-1000 ease-out ${
      dividerVisible ? 'opacity-80 translate-y-0' : 'opacity-0 translate-y-6'
    }`}
  />
</div>


  {/* Compartí tus Fotos */}
<section
  id="photos-section"
  className="py-16 md:py-24 font-['Lora']"
  style={{ backgroundColor: 'rgb(251, 248, 242)' }}
>
  <div className="container mx-auto px-4">
    <div className="max-w-3xl mx-auto text-center">
      <Camera
        className={`w-12 h-12 mx-auto mb-5 text-warm-taupe ${
          photosVisible ? 'animate-fade-in' : 'opacity-0'
        }`}
      />

      <h2
        className={`font-serif italic text-4xl md:text-6xl text-dark-espresso mb-10 ${
          photosVisible ? 'animate-fade-in-up' : 'opacity-0'
        }`}
      >
        Compartí tus Fotos
      </h2>

      <div
        className={`bg-white rounded-2xl shadow-xl p-8 md:p-12 ${
          photosVisible ? 'animate-fade-in-up-delayed' : 'opacity-0'
        }`}
      >
        <p className="text-xl md:text-2xl text-dark-espresso mb-8">
          Queremos que seas parte de nuestros recuerdos
        </p>

        <p className="text-base md:text-lg leading-relaxed text-gray-sage max-w-2xl mx-auto">
          Subí tus fotos y videos del casamiento a nuestra carpeta compartida
          para que podamos revivirlos juntos.
        </p>

        <div className="my-8 flex justify-center">
          <div className="w-2/3 border-t-2 border-gray-sage" />
        </div>

        <a
          href="https://drive.google.com/drive/folders/14iE95CFJ0oQY8LJUZPelQ4PyZeasqv5Z"
          target="_blank"
          rel="noopener noreferrer"
          className="w-full max-w-lg mx-auto flex items-center justify-center gap-2 bg-warm-taupe hover:bg-dark-espresso text-white px-8 py-4 rounded-full text-lg font-medium transition-all hover:scale-105 shadow-lg"
        >
          <Camera className="w-5 h-5" />
          Abrir Carpeta de Drive
        </a>

        <div className="max-w-lg mx-auto mt-8 rounded-xl bg-cream-beige/50 p-5 text-dark-espresso text-base">
          <p>Formatos aceptados: JPG, PNG, MP4, MOV</p>
          <p className="mt-1">Tamaño máximo por archivo: 100 MB</p>
        </div>
      </div>
    </div>
  </div>
</section>

{/* Cierre - Te esperamos */}
<section
  className="pt-0 pb-16 md:pt-0 md:pb-24"
  style={{ backgroundColor: 'rgb(251, 248, 242)'}}
  id="cierre"
>
  <div className="container mx-auto px-4">
    <div className="max-w-3xl mx-auto text-center space-y-10">

      <div className={`text-lg font-['Lora'] md:text-2xl text-dark-espresso ${cierreVisible ? 'animate-fade-in-content' : 'opacity-0'}`}>
        <p>Podés confirmar asistencia</p>
        <p>hasta el 15 de Enero.</p>
      </div>
                <section className="flex justify-center items-center py-8">


        <button
  onClick={openRSVPModal}
  className="w-full max-w-lg mx-auto flex items-center justify-center gap-2 bg-warm-taupe hover:bg-dark-espresso text-white px-8 py-4 rounded-full text-lg transition-all hover:scale-105 shadow-lg"
  style={{ fontFamily: "'Lora', serif" }}
>
  Confirmá acá tu asistencia
</button>

      </section>

      

      <div className="my-8 flex justify-center">
        <div className={`border-t-2 border-gray-sage ${cierreVisible ? 'animate-expand-width' : 'w-0'}`} />
      </div>

    <div>
  <p className="text-dark-espresso  font-serif italic text-4xl md:text-6xl mb-4">
    ¡Te esperamos!
  </p>
  <p className="text-dark-espresso  font-serif italic text-4xl md:text-6xl mb-4">
    {novios}
  </p>
</div>

    </div>
  </div>
</section>
        {/* Footer */}
        
        <footer className="bg-dark-espresso text-silver-mist py-8">
          <div className="container mx-auto px-4 text-center">
            <p className="flex items-center justify-center gap-2 mb-4">
              2026 © Creado con <Heart className="w-5 h-5 text-warm-taupe fill-current" /> para Flor & Yoel. 
            </p>

          </div>
        </footer>
      </div>

      {/* ============================================ */}
      {/* MODAL RSVP */}
      {/* ============================================ */}
      {showRSVPModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto animate-scale-in">
            {/* Header del Modal */}
            <div className="sticky top-0 bg-gradient-to-r from-warm-taupe to-dark-espresso text-white p-6 rounded-t-2xl flex justify-between items-center">
              <h2 className="font-serif italic text-3xl md:text-4xl">Confirmación de Asistencia</h2>
              <button
                onClick={closeRSVPModal}
                className="text-white hover:bg-white/20 rounded-full p-2 transition"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Contenido del Modal */}
            <div className="p-8">
              <div className="text-center text-dark-espresso space-y-4 mb-8">
                
                <p className="text-base md:text-lg leading-relaxed font-semibold text-warm-taupe">
                  Favor de completar el siguiente formulario:
                </p>
              </div>

              {/* Formulario de RSVP */}
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Nombre completo */}
                <div>
                  <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-2">
                    Nombres de asistentes*
                  </label>
                  <input
                    type="text"
                    id="nombre"
                    name="nombre"
                    required
                    value={formData.nombre}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-warm-taupe focus:border-warm-taupe transition placeholder:text-gray-400"
                    placeholder="Juan Pérez, María Gómez, Pedro López"
                  />
                </div>

                {/* Email 
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-warm-taupe focus:border-warm-taupe transition placeholder:text-gray-400"
                    placeholder="tu@email.com"
                  />
                </div>*/}

                {/* Teléfono */}
                <div>
                  <label htmlFor="telefono" className="block text-sm font-medium text-gray-700 mb-2">
                    Teléfono
                  </label>
                  <input
                    type="tel"
                    id="telefono"
                    name="telefono"
                    value={formData.telefono}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-warm-taupe focus:border-warm-taupe transition placeholder:text-gray-400"
                    placeholder="+52 123 456 7890"
                  />
                </div>

                {/* Asistencia */}
                <div>
                  <label htmlFor="asistencia" className="block text-sm font-medium text-gray-700 mb-2">
                    ¿Podrás asistir? *
                  </label>
                  <select
                    id="asistencia"
                    name="asistencia"
                    required
                    value={formData.asistencia}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-warm-taupe focus:border-warm-taupe transition text-gray-900"
                  >
                    <option value="si">Sí, confirmo asistencia ✓</option>
                    <option value="no">No, no podré asistir</option>
                  </select>
                </div>

                {/* Número de acompañantes 
                <div>
                  <label htmlFor="numeroAcompanantes" className="block text-sm font-medium text-gray-700 mb-2">
                    Número de acompañantes
                  </label>
                  <select
                    id="numeroAcompanantes"
                    name="numeroAcompanantes"
                    value={formData.numeroAcompanantes}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-warm-taupe focus:border-warm-taupe transition text-gray-900"
                  >
                    <option value="0">Solo yo</option>
                    <option value="1">1 acompañante</option>
                    <option value="2">2 acompañantes</option>
                    <option value="3">3 acompañantes</option>
                    <option value="4">4+ acompañantes</option>
                  </select>
                </div>*/}

                {/* Alergias */}
                <div>
                  <label htmlFor="alergias" className="block text-sm font-medium text-gray-700 mb-2">
                    ¿Tienes alguna alergia alimentaria?
                  </label>
                  <input
                    type="text"
                    id="alergias"
                    name="alergias"
                    value={formData.alergias}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-warm-taupe focus:border-warm-taupe transition placeholder:text-gray-400"
                    placeholder="Ej: Nueces, mariscos, lácteos..."
                  />
                </div>

                {/* Dieta especial */}
                <div>
                  <label htmlFor="dietaEspecial" className="block text-sm font-medium text-gray-700 mb-2">
                    Preferencia alimentaria
                  </label>
                  <select
                    id="dietaEspecial"
                    name="dietaEspecial"
                    value={formData.dietaEspecial}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-warm-taupe focus:border-warm-taupe transition text-gray-900"
                  >
                    <option value="ninguna">Ninguna</option>
                    <option value="vegetariano">Vegetariano</option>
                    <option value="vegano">Vegano</option>
                    <option value="sinGluten">Sin gluten</option>
                    <option value="otra">Otra</option>
                  </select>
                </div>

                

                {/* Estado del formulario */}
                {formStatus.message && (
                  <div className={`p-4 rounded-lg flex items-center gap-2 ${
                    formStatus.success ? 'bg-green-50 text-green-800 border border-green-200' :
                    formStatus.error ? 'bg-red-50 text-red-800 border border-red-200' :
                    'bg-blue-50 text-blue-800 border border-blue-200'
                  }`}>
                    {formStatus.success && <CheckCircle className="w-5 h-5" />}
                    {formStatus.error && <AlertCircle className="w-5 h-5" />}
                    <span>{formStatus.message}</span>
                  </div>
                )}

                {/* Botón de envío */}
                <button
                  type="submit"
                  disabled={formStatus.loading}
                  className={`w-full flex items-center justify-center gap-2 px-8 py-4 rounded-full text-lg font-medium transition-all shadow-lg ${
                    formStatus.loading
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-warm-taupe hover:bg-dark-espresso hover:scale-105'
                  } text-white`}
                >
                  {formStatus.loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Confirmar Asistencia
                    </>
                  )}
                </button>
              </form>

              <div className="mt-8 p-4 bg-cream-beige/50 border-l-4 border-warm-taupe rounded">
                <p className="text-sm text-dark-espresso">
                  <strong>Nota:</strong> Les pedimos mandar el comprobante de pago de las invitaciones a nuestro WhatsApp para confirmar su asistencia.
                </p>
                
              <p className="text-xs text-gray-500 mt-2 flex items-center justify-center gap-1">
  <Phone className="w-3.5 h-3.5" />
  En el comprobante incluir el nombre del invitado — WhatsApp: 2804218641 (Yoel) 3856216625 (Flor)
</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================ */}
      {/* ESTILOS DE ANIMACIÓN */}
      {/* ============================================ */}
      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes scale-in {
          from {
            transform: scale(0.9);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }

        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes scale-in-subtle {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes expand-width {
          from {
            width: 0;
          }
          to {
            width: 300px;
          }
        }

        @keyframes subtle-zoom {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
        }

        @keyframes slide-in-left {
          from {
            transform: translateX(100%);
            opacity: 0.5;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        @keyframes fade-out-left {
          from {
            opacity: 1;
          }
          to {
            opacity: 0;
          }
        }

        .animate-fade-in {
          animation: fade-in 0.8s ease-out;
        }

        .animate-slide-in-left {
          animation: slide-in-left 1.2s ease-out;
        }

        .animate-fade-out-left {
          animation: fade-out-left 1.2s ease-out;
        }

        .animate-scale-in {
          animation: scale-in 0.3s ease-out;
        }

        .animate-fade-in-up {
          animation: fade-in-up 1s ease-out forwards;
          opacity: 0;
        }

        .animate-fade-in-up-delayed {
          animation: fade-in-up 1s ease-out 0.3s forwards;
          opacity: 0;
        }

        .animate-fade-in-content {
          animation: fade-in-up 0.8s ease-out 0.5s forwards;
          opacity: 0;
        }

        .animate-scale-in-content {
          animation: scale-in-subtle 1s ease-out 0.6s forwards;
          opacity: 0;
        }

        .animate-fade-in-content-slow {
          animation: fade-in-up 0.8s ease-out 0.8s forwards;
          opacity: 0;
        }

        .animate-fade-in-content-slower {
          animation: fade-in-up 0.8s ease-out 1s forwards;
          opacity: 0;
        }

        .animate-fade-in-button {
          animation: scale-in-subtle 0.8s ease-out 1.2s forwards;
          opacity: 0;
        }

        .animate-expand-width {
          animation: expand-width 1s ease-out 0.7s forwards;
          width: 0;
        }

        @media (max-width: 768px) {
          @keyframes expand-width {
            from {
              width: 0;
            }
            to {
              width: 200px;
            }
          }
        }

        .animate-subtle-zoom {
          animation: subtle-zoom 20s ease-in-out infinite;
        }

        /* Infinite scroll carousel - Loop infinito continuo */
        @keyframes infinite-scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        .infinite-scroll-container {
          display: flex;
          width: max-content;
          animation: infinite-scroll 30s linear infinite;
        }

        .infinite-scroll-container:hover {
          animation-play-state: paused;
        }

        .infinite-scroll-item {
          position: relative;
          flex-shrink: 0;
          width: 33.333vw;
          height: 75vh;
          overflow: hidden;
        }

        @media (max-width: 768px) {
          .infinite-scroll-item {
            width: 100vw;
          }
        }
      `}</style>
    </div>
  );
}
