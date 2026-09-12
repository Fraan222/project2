import React, { useState, useEffect, type ChangeEvent, type FormEvent } from 'react';
import { Calendar, MapPin, Heart, Instagram, Send, CheckCircle, AlertCircle, X, Gift, Camera, Wallet, Section } from 'lucide-react';

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
  email: string;
  telefono: string;
  asistencia: 'si' | 'no' | 'talvez';
  numeroAcompanantes: '0' | '1' | '2' | '3' | '4';
  alergias: string;
  dietaEspecial: 'ninguna' | 'vegetariano' | 'vegano' | 'sinGluten' | 'otra';
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

interface StoryItem {
  title: string;
  text: string;
  image: string;
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
  const [splashImageLoaded, setSplashImageLoaded] = useState<boolean>(false);
  const [videoLoaded, setVideoLoaded] = useState<boolean>(false);

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

  const [formData, setFormData] = useState<FormData>({
    nombre: '',
    email: '',
    telefono: '',
    asistencia: 'si',
    numeroAcompanantes: '0',
    alergias: '',
    dietaEspecial: 'ninguna',
    mensaje: ''
  });

  const [formStatus, setFormStatus] = useState<FormStatus>({
    loading: false,
    success: false,
    error: false,
    message: ''
  });

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

  // ============================================
  // CONFIGURACIÓN
  // ============================================

  const GOOGLE_SCRIPT_URL: string = 'https://script.google.com/macros/s/AKfycbyHVJ8yX7XIkdAFq-kEmRnQ6UEoHjwMn69r2elgWpzhNCrfltHYnGhaauXoQjy2_O6JEw/exec';
  const weddingDate: Date = new Date(2026, 3, 18, 17, 0, 0);

  // URLs - Video local de la pareja
  const VIDEO_URL: string = '/Floryjuan-Reel-optimizdo.mp4';
  const VIDEO_BACKGROUND_IMAGE: string = isMobile ? '/abrazo-2do-outfit.webp' : '/hero-full-screen.webp';

  // Imágenes del carousel
  const carouselImages: string[] = [
    '/DSC_5712.JPG',
    '/DSC_6465.JPG',
    '/DSC_6608.JPG',
    '/DSC_6751.JPG',
    '/DSC_6717.jpg',
    '/Flor&Juan-8.webp',
    '/Flor-a-Cococho.webp',
  ];

  const novios: string = "Flor & Yoel";


  // ============================================
  // EFECTOS
  // ============================================

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

  // Efecto para precargar recursos multimedia
  useEffect(() => {
    let resourcesLoaded = 0;
    const totalResources = 2; // Imagen del splash + video

    const updateProgress = () => {
      resourcesLoaded++;
      const progress = (resourcesLoaded / totalResources) * 100;
      setLoadingProgress(progress);

      // Si todos los recursos están cargados, ocultar pantalla de carga
      if (resourcesLoaded === totalResources) {
        setTimeout(() => {
          setIsLoading(false);
        }, 500); // Pequeño delay para suavizar la transición
      }
    };

    // Precargar imagen del splash screen
    const splashImage = new Image();
    splashImage.src = '/manos-anillo-horizontal.webp';
    splashImage.onload = () => {
      setSplashImageLoaded(true);
      updateProgress();
    };
    splashImage.onerror = () => {
      console.error('Error cargando imagen del splash');
      setSplashImageLoaded(true);
      updateProgress();
    };

    // Precargar video
    const videoElement = document.createElement('video');
    videoElement.src = VIDEO_URL;
    videoElement.preload = 'auto';

    videoElement.addEventListener('loadeddata', () => {
      setVideoLoaded(true);
      updateProgress();
    });

    videoElement.addEventListener('error', () => {
      console.error('Error cargando video');
      setVideoLoaded(true);
      updateProgress();
    });

    videoElement.load();

    // Cleanup
    return () => {
      splashImage.onload = null;
      splashImage.onerror = null;
    };
  }, [VIDEO_URL]);

  // ============================================
  // FUNCIONES
  // ============================================

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

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();

    if (!formData.nombre || !formData.email) {
      setFormStatus({
        loading: false,
        success: false,
        error: true,
        message: 'Por favor completa al menos tu nombre y email'
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
          timeZone: 'America/Argentina/Buenos_Aires',
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        }),
        timestamp: new Date().toISOString()
      };

      console.log('Enviando datos:', dataToSend);

      await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend)
      });

      // Con mode: 'no-cors' no podemos leer la respuesta, pero si no hay error, asumimos que funcionó
      console.log('Respuesta enviada correctamente');

      setFormStatus({
        loading: false,
        success: true,
        error: false,
        message: '¡Gracias! Tu confirmación ha sido registrada exitosamente 🎉'
      });

      setFormData({
        nombre: '',
        email: '',
        telefono: '',
        asistencia: 'si',
        numeroAcompanantes: '0',
        alergias: '',
        dietaEspecial: 'ninguna',
        mensaje: ''
      });

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
        message: 'Hubo un error al enviar tu respuesta. Por favor intenta de nuevo.'
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
            <p className="text-xl md:text-2xl text-white mb-8">
              Nos casamos
            </p>
            <p className="text-lg md:text-xl text-silver-mist mb-12">
              6 de Febrero, 2027
            </p>
            <p className="text-sm md:text-base text-silver-mist animate-bounce">
              Toca para continuar
            </p>
          </div>
        </div>
      )}

      {/* ============================================ */}
      {/* SECCIÓN DE VIDEO */}
      {/* ============================================ */}
      {!showSplash && !videoEnded && (
        <div
          className="fixed inset-0 z-50 bg-cover bg-center"
          style={{ backgroundImage: `url('${VIDEO_BACKGROUND_IMAGE}')` }}
        >
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <video
              autoPlay
              playsInline
              onEnded={handleVideoEnd}
              className="max-w-full max-h-full object-contain"
            >
              <source src={VIDEO_URL} type="video/mp4" />
              Tu navegador no soporta el video.
            </video>
          </div>
          {/* Botón para saltar el video */}
          <button
            onClick={handleVideoEnd}
            className="absolute bottom-8 right-8 bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-full hover:bg-white/30 transition"
          >
            Saltar video
          </button>
        </div>
      )}

      {/* ============================================ */}
      {/* CONTENIDO PRINCIPAL (visible después del video) */}
      {/* ============================================ */}
      <div className={`transition-opacity duration-1000 ${!videoEnded && !showSplash ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>

        {/* ============================================ */}
        {/* HERO SECTION - Imagen de fondo + Countdown + Botón RSVP */}
        {/* ============================================ */}
        <section
          className="min-h-screen flex items-center justify-center relative bg-cover bg-center"
          style={{
            backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('DSC_6050.JPG')`
          }}
        >
          <div className="container mx-auto px-4 text-center text-white">
            <div className="text-3xl md:text-4xl mb-6 font-serif italic text-amber-200">
             Nos Casamos
            </div>

            <div className="font-serif italic text-5xl md:text-7xl my-8">
             {novios}
            </div>

            <p className="text-xl md:text-2xl mb-2"> Sábado 06 de Febrero 2027</p>
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
              className="group relative inline-flex items-center justify-center gap-3 bg-warm-taupe hover:bg-dark-espresso text-white px-12 py-5 rounded-full text-xl font-semibold transition-all duration-300 hover:scale-110 shadow-2xl hover:shadow-gray/50"
            >
              Confirma acá tu asistencia
            </button>
          </div>
        </section>

        {/* ============================================ */}
        {/* SECCIONES ADICIONALES */}
        {/* ============================================ */}

        {/* Invitation Text */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center text-dark-espresso space-y-4">
              <p className="text-lg md:text-2xl font-family-sans">Porque sos parte de nuestras vidas</p>
              <p className="text-lg md:text-2xl font-family-sans ">queremos compartir con vos la alegría de casarnos</p>
            </div>
          </div>
        </section>

        {/* Date & Time Section */}
        <section
          className="py-16 md:py-24 relative bg-cover bg-center bg-fixed overflow-hidden"
          style={{
            backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.5), rgba(255, 255, 255, 0.5)), `
          }}
          id="date-time"
          >
          {/* Animación de parallax sutil en el fondo */}
          <div
            className="absolute inset-0 bg-cover bg-center animate-subtle-zoom"
            style={{
              backgroundImage: `url('DSC_6077.JPG')`,
              opacity: 0.6
            }}
          />

          <div className="container mx-auto px-4 relative z-10">
            <h2 className={`font-serif italic text-4xl md:text-6xl text-center text-dark-espresso mb-12 ${dateTimeVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>
              Fecha y Hora
            </h2>

            <div className={`max-w-2xl mx-auto bg-white/20 backdrop-blur-sm shadow-2xl p-8 md:p-12 rounded-2xl ${dateTimeVisible ? 'animate-fade-in-up-delayed' : 'opacity-0'}`}>
              <div className="text-center space-y-6">
                <div className={`text-xl md:text-2xl text-dark-espresso ${dateTimeVisible ? 'animate-fade-in-content' : 'opacity-0'}`}>Sábado</div>
                <div className={`text-6xl md:text-8xl font-bold text-warm-taupe ${dateTimeVisible ? 'animate-scale-in-content' : 'opacity-0'}`}>06</div>
                <div className={`text-xl md:text-2xl text-dark-espresso ${dateTimeVisible ? 'animate-fade-in-content' : 'opacity-0'}`}>Febrero 2027</div>

                <div className="my-8 flex justify-center">
                  <div className={`border-t-2 border-gray-sage ${dateTimeVisible ? 'animate-expand-width' : 'w-0'}`} />
                </div>

                <div className="space-y-6">
                  <div className={dateTimeVisible ? 'animate-fade-in-content-slow' : 'opacity-0'}>
                  <p className="font-semibold text-dark-espresso mb-2">Recepción:</p>
                  <p className="text-3xl md:text-4xl text-warm-taupe">18:30<span className='text-xl'>pm</span></p>
                  </div>
                  
                  <div className={dateTimeVisible ? 'animate-fade-in-content-slower' : 'opacity-0'}>
                  <p className="font-semibold text-dark-espresso mb-2">Ceremonia y Celebración:</p>
                    <p className="text-3xl md:text-4xl text-warm-taupe">19:00 - 01:00 <span className='text-xl'> hs</span></p>
                  </div>
                </div>
                <div className='text-transparent'>si encontraste esto es de curioso y no te ganaste nada</div>
              </div>
            </div>
          </div>
        </section>

        {/* Invitation Text */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center text-dark-espresso space-y-4">
            <p className="font-serif italic text-lg md:text-2xl">"Deléitate en el Señor, y Él concederá los deseos de tu corazón"</p>
              <p className="text-lg  md:text-2xl font-family-sans">Dios permitió que nuestros caminos se encontraran.</p>
                   <p className="text-lg  md:text-2xl font-family-sans">Hoy, con el corazón lleno de ilusión, elegimos compartir la vida juntos</p>
              <p className="text-lg  md:text-2xl font-family-sans">y comenzar a vivir uno de nuestros sueños.</p>
                   <p className="text-lg  md:text-2xl font-family-sans">Con amor y fe, decidimos dar este gran paso
                    y celebrarlo con quienes son parte de nuestra historia.</p>
              <p className="text-lg  md:text-2xl font-family-sans">¡Te esperamos para compartir juntos este nuevo comienzo!</p>
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
          {/* Animación de parallax sutil en el fondo 
          <div
            className="absolute inset-0 bg-cover bg-center animate-subtle-zoom"
            style={{
              backgroundImage: `url('/ful-screen-ubicacion.webp')`,
              opacity: 0.7
            }}
          />*/}

          <div className="container mx-auto px-4 relative z-10">
            <h2 className={`font-serif italic text-4xl md:text-6xl text-center text-dark-espresso mb-12 ${dateTimeVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>
              Ubicación
            </h2>

            <div className={`max-w-2xl mx-auto bg-white/40 backdrop-blur-sm shadow-2xl p-8 md:p-12 rounded-2xl ${dateTimeVisible ? 'animate-fade-in-up-delayed' : 'opacity-0'}`}>
              <div className="text-center space-y-6">
                <div className={`text-xl md:text-2xl text-dark-espresso ${dateTimeVisible ? 'animate-fade-in-content' : 'opacity-0'}`}> 
                <h3 className="text-2xl md:text-3xl font-semibold text-warm-taupe text-center mb-4">
                Saint George Village
              </h3></div>
                <div className={`text-6xl md:text-8xl font-bold text-warm-taupe ${dateTimeVisible ? 'animate-scale-in-content' : 'opacity-0'}`}> </div>
                <div className={`text-xl md:text-2xl text-dark-espresso ${dateTimeVisible ? 'animate-fade-in-content' : 'opacity-0'}`}> </div>

                <div className="my-8 flex justify-center">
                  <div className={`border-t-2 border-gray-sage ${dateTimeVisible ? 'animate-expand-width' : 'w-0'}`} />
                </div>

                <div className="space-y-6">
                  <div className={dateTimeVisible ? 'animate-fade-in-content-slow' : 'opacity-0'}>
                <p className="text-center text-gray-sage mb-8">
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
                className="flex items-center justify-center gap-2 bg-warm-taupe hover:bg-dark-espresso text-white px-8 py-4 rounded-full text-lg font-medium transition-all hover:scale-105 shadow-lg w-full"
              >
                <MapPin className="w-5 h-5" />
                Abrir en Google Maps
              </a>
              </div>
            </div>
          </div>
        </section>


                {/* Price Section  */}
        <section className="py-16 md:py-24" id="prices-section">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <Wallet className={`w-12 h-12 mx-auto text-warm-taupe mb-4 ${pricesVisible ? 'animate-fade-in' : 'opacity-0'}`} />
              <h2 className={`font-serif italic text-4xl md:text-6xl text-dark-espresso mb-8 ${pricesVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>
               Valor de las Tarjetas
              </h2>

              <div className={`bg-white rounded-2xl shadow-xl p-8 md:p-12 ${pricesVisible ? 'animate-fade-in-up-delayed' : 'opacity-0'}`}>
                {/* Contenedor de las dos listas de precios */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
                  {/* Lista de precios para Adultos */}
                  <div>
                    <p className="text-lg font-medium text-dark-espresso mb-4">Adultos</p>
                    <ul className="text-gray-sage text-lg">
                      <li className="mb-4">Septiembre 2026 - Diciembre 2026: $100.000</li>
                      <li className="mb-4">Enero 2027: $115.000</li>
                    </ul>
                  </div>

                  {/* Lista de precios para Menores */}
                  <div>
                    <p className="text-lg font-medium text-dark-espresso mb-4">Menores de 3 a 10 años</p>
                    <ul className="text-gray-sage text-lg">
                      <li className="mb-4">Septiembre 2026 - Diciembre 2026: $40.000</li>
                      <li className="mb-4">Enero 2027: $45.000</li>
                    </ul>
                  </div>
                </div>

                {/* Texto aclaratorio */}
                <div className="text-center mb-8">
                <p className="text-sm text-gray-sage italic">El valor de la tarjeta varía según el mes en el que se realice el pago</p>
                <p className="text-sm text-gray-sage italic">* Menores de 3 años no pagan tarjeta</p>
                  </div>

                <div className="space-y-6">
                  <div className="bg-cream-beige/20 rounded-xl p-6">
                    <h3 className="text-xl font-semibold text-warm-taupe mb-3">Datos para el pago</h3>
                    <p className="text-gray-sage">
                      Alias: <span className="font-mono font-bold">Alias-De-Nvios</span><br />
                      CVU: <span className="font-mono font-bold">-------</span><br />
                      Banco: <span className="font-mono font-bold">Nombre de Banco</span><br />
                      Titular: <span className="font-mono font-bold">Nombre de Titular</span><br /><br />

                      Por favor, verificar los datos antes de realizar la transferencia
                      
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
        >
          <div className="w-full">
            <div className="text-center mb-8 md:mb-12 px-4">
              <h2 className="font-serif italic text-3xl md:text-5xl text-dark-espresso mb-4">
                Acompañanos en esta aventura juntos
              </h2>
              <p className="text-gray-sage text-lg">sé testigo del inicio de nuestro viaje</p>
            </div>

            {/* Carousel Container - Mobile: 1 image, Desktop: infinite loop */}
            <div className="relative w-full">
              {/* Mobile: Single image carousel */}
              <div className="md:hidden h-[70vh] relative overflow-hidden shadow-2xl bg-gray-100">
                {carouselImages.map((image, index) => (
                  <div
                    key={index}
                    className={`absolute inset-0 w-full h-full transition-all duration-1000 ease-in-out ${
                      index === currentSlide
                        ? 'opacity-100 scale-100'
                        : 'opacity-0 scale-95'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`Foto ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>

              {/* Desktop: Infinite scroll carousel - loop continuo */}
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
                      {/* Overlay sutil en hover */}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300" />
                    </div>
                  ))}
                  {/* Segunda serie de imágenes (duplicado para loop infinito) */}
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
                      {/* Overlay sutil en hover */}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <br />
          <br />
        </section>


        

        {/* Dress Code Section */}
        <section
          className="py-16 md:py-24 relative bg-cover bg-center bg-fixed overflow-hidden"
          style={{
            backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.5), rgba(255, 255, 255, 0.5)), url('/dress-code-bg.webp')`
          }}
          id="dress-code"
        >
          {/* Animación de parallax sutil en el fondo */}
          <div
            className="absolute inset-0 bg-cover bg-center animate-subtle-zoom"
            style={{
              backgroundImage: `url('/dress-code-bg.webp')`,
              opacity: 0.5
            }}
          />

          <div className="container mx-auto px-4 relative z-10">
            <h2 className={`font-serif italic text-4xl md:text-6xl text-center text-dark-espresso mb-12 ${dressCodeVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>
              Código de Vestimenta
            </h2>

            <div className={`max-w-2xl mx-auto bg-white/20 backdrop-blur-sm shadow-2xl p-8 md:p-12 rounded-2xl ${dressCodeVisible ? 'animate-fade-in-up-delayed' : 'opacity-0'}`}>
              <div className="text-center space-y-6">
                <div className={`text-2xl md:text-3xl font-semibold text-warm-taupe ${dressCodeVisible ? 'animate-fade-in-content' : 'opacity-0'}`}>
                  Formal
                </div>

                <div className={`text-lg text-dark-espresso ${dressCodeVisible ? 'animate-fade-in-content' : 'opacity-0'}`}>
                </div>

                <div className="my-8 flex justify-center">
                  <div className={`border-t-2 border-gray-sage ${dressCodeVisible ? 'animate-expand-width' : 'w-0'}`} />
                </div>
                    /*
                <div className="grid md:grid-cols-2 gap-6 text-left">
                 <div className={`bg-cream-beige/20 rounded-xl p-6 ${dressCodeVisible ? 'animate-fade-in-content-slow' : 'opacity-0'}`}>
                    {/*<h3 className="text-xl font-semibold text-dark-espresso mb-3">Para Ellas</h3>*/}
                    <ul className="space-y-2 text-gray-sage">

                    <li> </li>
                    <li></li>

                    </ul>
                  </div>

                  <div className={`bg-cream-beige/20 rounded-xl p-6 ${dressCodeVisible ? 'animate-fade-in-content-slower' : 'opacity-0'}`}>
                   {/* <h3 className="text-xl font-semibold text-dark-espresso mb-3">Para Ellos</h3>*/}
                    <ul className="space-y-2 text-gray-sage">
                      <li></li>
                      <li></li>
                      <li></li>
                    </ul>
                  </div>
                </div>
 
              </div>
            </div>
          </div>
        </section>

      <section className="flex justify-center items-center py-8">
        <button
          onClick={openRSVPModal}
          className="group relative inline-flex items-center justify-center gap-3 bg-warm-taupe hover:bg-dark-espresso text-white px-12 py-5 rounded-full text-xl font-semibold transition-all duration-300 hover:scale-110 shadow-2xl hover:shadow-gray/50"
        >
          Confirma acá tu asistencia
        </button>
      </section>

        {/* Gifts Section */}
        <section className="py-16 md:py-24" id="gifts-section">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <Gift className={`w-12 h-12 mx-auto text-warm-taupe mb-4 ${giftsVisible ? 'animate-fade-in' : 'opacity-0'}`} />
              <h2 className={`font-serif italic text-4xl md:text-6xl text-dark-espresso mb-8 ${giftsVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>
                Regalos
              </h2>

              <div className={`bg-white rounded-2xl shadow-xl p-8 md:p-12 ${giftsVisible ? 'animate-fade-in-up-delayed' : 'opacity-0'}`}>
                <div className="space-y-6">
                  <p className={`text-lg md:text-xl text-dark-espresso ${giftsVisible ? 'animate-fade-in-content' : 'opacity-0'}`}>
                    Aunque parezca una frase hecha, de corazón creemos que tu presencia es nuestro mejor regalo
                  </p>

                  <div className={`text-base md:text-lg text-gray-sage ${giftsVisible ? 'animate-fade-in-content-slow' : 'opacity-0'}`}>
                    <p className="mb-4">
                      Si aun así querés hacernos un presente podés transferir el monto que desees para nuestra luna de miel a la siguiente cuenta:
                    </p>
                  </div>

                  <div className="my-8 flex justify-center">
                    <div className={`border-t-2 border-gray-sage ${giftsVisible ? 'animate-expand-width' : 'w-0'}`} />
                  </div>

                  <div className={`bg-cream-beige/20 rounded-xl p-6 ${giftsVisible ? 'animate-fade-in-content-slower' : 'opacity-0'}`}>
                    <h3 className="text-xl font-semibold text-warm-taupe mb-3">Datos para transferencias</h3>
                    <p className="text-gray-sage">
                      Alias: <span className="font-mono font-bold">Casamiento-flor-juan</span><br />
                      CVU: <span className="font-mono font-bold">0000003100047474872326</span><br />
                      Banco: <span className="font-mono font-bold">Mercado Pago</span><br />
                      Titular: <span className="font-mono font-bold">Juan Cruz Mezzopeva</span>
                    </p>
                  </div>

                  <div className={`mt-8 ${giftsVisible ? 'animate-fade-in-button' : 'opacity-0'}`}>
                    <a
                      href="https://docs.google.com/document/d/1J_pUsa5ua8Zidid2AEv3gPAqq3zKy0vypBNAF58iTjk/edit?tab=t.0"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 bg-warm-taupe hover:bg-dark-espresso text-white px-8 py-4 rounded-full text-lg font-medium transition-all hover:scale-105 shadow-lg w-full"
                    >
                      <Gift className="w-5 h-5" />
                     {/* Ver Lista de Regalos*/}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        
        <footer className="bg-dark-espresso text-silver-mist py-8">
          <div className="container mx-auto px-4 text-center">
            <p className="flex items-center justify-center gap-2 mb-4">
              2026 © Creado con <Heart className="w-5 h-5 text-warm-taupe fill-current" /> 
            </p>
            
            <div className="flex justify-center gap-6">
              <a
                href="https://instagram.com/florenciamontes90"
                target="_blank"
                rel="noopener noreferrer"
                className="text-warm-taupe hover:text-cream-beige transition-all hover:scale-110"
              >
                <Instagram className="w-8 h-8" />
              </a>
              <a
                href="https://instagram.com/juan_cruz_mezzopeva"
                target="_blank"
                rel="noopener noreferrer"
                className="text-warm-taupe hover:text-cream-beige transition-all hover:scale-110"
              >
                <Instagram className="w-8 h-8" />
              </a>
            </div>
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
                  Por favor completa el siguiente formulario:
                </p>
              </div>

              {/* Formulario de RSVP */}
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Nombre completo */}
                <div>
                  <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre Completo *
                  </label>
                  <input
                    type="text"
                    id="nombre"
                    name="nombre"
                    required
                    value={formData.nombre}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-warm-taupe focus:border-warm-taupe transition placeholder:text-gray-400"
                    placeholder="Tu nombre completo"
                  />
                </div>

                {/* Email */}
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
                </div>

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

                {/* Número de acompañantes */}
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
                </div>

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
                    <option value="ninguna">Ninguna (como todo)</option>
                    <option value="vegetariano">Vegetariano</option>
                    <option value="vegano">Vegano</option>
                    <option value="sinGluten">Sin gluten</option>
                    <option value="otra">Otra (especifica en mensaje)</option>
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
                  <strong>Nota:</strong>Les pedimos mandar el comprobante de pago de las invitaciones a nuestro WhatsApp para confirmar su asistencia.
                </p>
                <p className="text-xs text-gray-500 mt-2">*En el comprobante incluir el nombre del invitado WhatsApp 3574401483 (Juan)  3854486562 (Flor)</p>
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
