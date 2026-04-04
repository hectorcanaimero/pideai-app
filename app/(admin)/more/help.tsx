import { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Linking,
} from "react-native";
import {
  Sparkles,
  Search,
  ChevronLeft,
  ChevronDown,
  ChevronUp,
  MessageCircle,
  Rocket,
  ShoppingCart,
  LayoutGrid,
  Settings,
  CreditCard,
  Users,
} from "lucide-react-native";

// ─── Data ────────────────────────────────────────────────────────────────────

interface Article {
  id: string;
  title: string;
  steps: string[];
  tip?: string;
  note?: string;
}

interface Category {
  id: string;
  label: string;
  icon: React.ReactNode;
  color: string;
  articles: Article[];
}

const CATEGORIES: Category[] = [
  {
    id: "empezar",
    label: "Primeros pasos",
    icon: <Rocket size={20} color="#EB1C8D" />,
    color: "#EB1C8D",
    articles: [
      {
        id: "crear-tienda",
        title: "Cómo crear tu tienda en PideAI",
        steps: [
          "Descargá la app de PideAI o entrá a pideai.com.",
          "Registrate con tu correo electrónico o Google.",
          "Completá el formulario con el nombre de tu negocio, dirección y subdomain (ej: mitienda.pideai.com).",
          "Seleccioná el tipo de negocio (comida, tienda, catálogo digital).",
          "¡Listo! Tu tienda ya está creada y lista para configurar.",
        ],
        tip: "Elegí un subdomain corto y fácil de recordar. Es lo que tus clientes van a escribir para encontrarte.",
        note: "Podés cambiar el nombre y logo de tu tienda más tarde desde Configuración → Info de tienda.",
      },
      {
        id: "configurar-horario",
        title: "Configura tu horario de atención",
        steps: [
          "Andá a Más → Configuración → Horarios.",
          "Seleccioná los días que tu negocio está abierto.",
          "Agregá los turnos de cada día (ej: 8:00 - 12:00 y 14:00 - 20:00).",
          "Guardá los cambios.",
        ],
        tip: "Podés forzar la apertura o cierre de tu tienda en cualquier momento desde la misma pantalla, sin importar el horario configurado.",
      },
      {
        id: "primeros-productos",
        title: "Agrega tus primeros productos",
        steps: [
          "Andá a la pestaña Menú en la barra inferior.",
          "Creá al menos una categoría (ej: Hamburguesas, Bebidas).",
          "Dentro de la categoría, tocá + para agregar un producto.",
          "Completá nombre, descripción, precio y subí una foto.",
          "Guardá el producto y ya aparece en tu catálogo.",
        ],
        tip: "Los productos con foto venden hasta 3x más. Usá fotos con buena luz y fondo limpio.",
        note: "Podés reordenar las categorías y productos arrastrándolos desde la web.",
      },
      {
        id: "metodos-pago",
        title: "Activa tus métodos de pago",
        steps: [
          "Andá a Más → Configuración → Métodos de pago.",
          "Tocá + para agregar un nuevo método.",
          "Seleccioná el tipo: Pago Móvil, Zelle, Binance, Efectivo, etc.",
          "Completá los datos de la cuenta (banco, teléfono, email según el método).",
          "Activá el método y guardá.",
        ],
        tip: "Ofrecé al menos 2-3 métodos de pago para darle opciones a tus clientes.",
      },
    ],
  },
  {
    id: "pedidos",
    label: "Gestión de Pedidos",
    icon: <ShoppingCart size={20} color="#22C55E" />,
    color: "#22C55E",
    articles: [
      {
        id: "recibir-pedidos",
        title: "Cómo recibir y confirmar pedidos",
        steps: [
          "Cuando un cliente hace un pedido, recibís una notificación con sonido.",
          "El pedido aparece en la pestaña Pedidos con estado 'Pendiente'.",
          "Revisá los detalles: productos, extras, dirección de entrega y método de pago.",
          "Tocá 'Confirmar' para aceptar el pedido o 'Rechazar' si no podés atenderlo.",
          "El cliente recibe una notificación con el cambio de estado.",
        ],
        tip: "Confirmá los pedidos lo más rápido posible. Los clientes valoran la velocidad de respuesta.",
        note: "Si tenés inventario activo, al confirmar un pedido se descuenta automáticamente el stock.",
      },
      {
        id: "cambiar-estado",
        title: "Cambiar el estado de un pedido",
        steps: [
          "Abrí el pedido desde la lista de pedidos.",
          "Tocá el botón de cambiar estado.",
          "Los estados disponibles son: Pendiente → Confirmado → En preparación → Listo → Entregado.",
          "Cada cambio notifica al cliente automáticamente.",
        ],
        note: "Si cancelás un pedido que ya fue confirmado, el stock se restaura automáticamente.",
      },
      {
        id: "notificaciones-sonido",
        title: "Notificaciones de sonido para pedidos",
        steps: [
          "Andá a Más → Configuración → Avanzado.",
          "Activá las notificaciones de sonido.",
          "Configurá el volumen y la cantidad de repeticiones.",
          "Asegurate de tener las notificaciones de la app activadas en la configuración de tu celular.",
        ],
        tip: "Si atendés en un lugar con mucho ruido, subí el volumen y las repeticiones para no perder pedidos.",
      },
    ],
  },
  {
    id: "catalogo",
    label: "Catálogo y Productos",
    icon: <LayoutGrid size={20} color="#A855F7" />,
    color: "#A855F7",
    articles: [
      {
        id: "crear-categorias",
        title: "Crear y organizar categorías",
        steps: [
          "Andá a la pestaña Menú.",
          "Tocá el botón + para crear una nueva categoría.",
          "Escribí el nombre (ej: Pizzas, Bebidas, Postres).",
          "Opcionalmente agregá una imagen de portada.",
          "Guardá y la categoría aparece en tu catálogo.",
        ],
        tip: "Usá nombres claros y cortos. Tus clientes deberían encontrar lo que buscan en menos de 3 segundos.",
      },
      {
        id: "productos-extras",
        title: "Agregar productos con extras",
        steps: [
          "Creá o editá un producto.",
          "En la sección de extras, creá un grupo (ej: 'Tamaño', 'Ingredientes adicionales').",
          "Agregá las opciones dentro del grupo con nombre y precio adicional.",
          "Configurá si la selección es única (radio) o múltiple (checkbox).",
          "Marcá si el grupo es obligatorio u opcional.",
        ],
        tip: "Los extras son una excelente forma de aumentar el ticket promedio. Ofrecé opciones como 'agregar queso extra' o 'tamaño grande'.",
        note: "Podés crear grupos de extras globales y asignarlos a múltiples productos para no repetir configuración.",
      },
    ],
  },
  {
    id: "configuracion",
    label: "Configuración",
    icon: <Settings size={20} color="#3B82F6" />,
    color: "#3B82F6",
    articles: [
      {
        id: "config-tienda",
        title: "Configuración general de tu tienda",
        steps: [
          "Andá a Más → Configuración.",
          "En Info de tienda podés cambiar el nombre, logo, descripción y datos de contacto.",
          "En Horarios configurás cuándo está abierta tu tienda.",
          "En Pagos y Métodos de pago gestionás cómo te pagan los clientes.",
          "En Pedidos configurás el modo de operación (delivery, pickup o menú digital).",
          "En Entrega configurás las zonas y costos de delivery.",
          "En Diseño personalizás los colores y apariencia de tu catálogo.",
          "En Avanzado encontrás opciones de notificaciones y configuración técnica.",
        ],
        tip: "Completá toda la configuración antes de compartir tu tienda con clientes. Una tienda bien configurada genera más confianza.",
      },
    ],
  },
  {
    id: "suscripcion",
    label: "Suscripción y Planes",
    icon: <CreditCard size={20} color="#F59E0B" />,
    color: "#F59E0B",
    articles: [
      {
        id: "planes",
        title: "Planes y funcionalidades",
        steps: [
          "Andá a Más → Suscripción para ver tu plan actual.",
          "PideAI ofrece varios planes: Free, Starter, Pro y Enterprise.",
          "Cada plan desbloquea más funcionalidades: productos ilimitados, módulos adicionales, soporte prioritario, etc.",
          "Para cambiar de plan, seleccioná el que te interese y seguí los pasos de pago.",
          "Los cambios de plan se aplican inmediatamente.",
        ],
        tip: "Empezá con el plan Free para probar la plataforma. Cuando tu negocio crezca, actualizá al plan que mejor se adapte.",
        note: "Si bajás de plan, algunas funcionalidades pueden quedar deshabilitadas pero tus datos se mantienen.",
      },
    ],
  },
  {
    id: "clientes",
    label: "Clientes",
    icon: <Users size={20} color="#EC4899" />,
    color: "#EC4899",
    articles: [
      {
        id: "gestion-clientes",
        title: "Gestión de clientes",
        steps: [
          "Andá a la pestaña Clientes en la barra inferior.",
          "Acá ves la lista de todos los clientes que hicieron pedidos en tu tienda.",
          "Tocá un cliente para ver su historial de pedidos y datos de contacto.",
          "Podés buscar clientes por nombre o teléfono.",
          "Los clientes se registran automáticamente cuando hacen su primer pedido.",
        ],
        tip: "Revisá periódicamente tu lista de clientes. Los clientes frecuentes merecen atención especial.",
      },
    ],
  },
];

const FAQS = [
  {
    q: "¿Cómo recibo notificaciones de pedidos?",
    a: "Las notificaciones llegan automáticamente cuando un cliente hace un pedido. Asegurate de tener las notificaciones activadas en la configuración de tu celular. Podés configurar el sonido de alerta en Más → Configuración → Avanzado.",
  },
  {
    q: "¿Cómo cambio los horarios de mi tienda?",
    a: "Andá a Más → Configuración → Horarios. Podés agregar múltiples turnos por día y forzar la apertura o cierre de la tienda en cualquier momento.",
  },
  {
    q: "¿Cómo agrego métodos de pago?",
    a: "En Más → Configuración → Métodos de pago podés agregar Pago Móvil, Zelle, Binance u otros métodos. Tus clientes verán esta información al momento de pagar.",
  },
  {
    q: "¿Puedo ver mi tienda como la ven mis clientes?",
    a: "Sí, abrí el navegador de tu celular y visitá tu-tienda.pideai.com para ver la vista de cliente exactamente como la ven ellos.",
  },
  {
    q: "¿Qué pasa si cancelo un pedido ya confirmado?",
    a: "Si tu tienda tiene control de inventario activo, al cancelar un pedido confirmado el stock se restaura automáticamente. El cliente recibe una notificación de la cancelación.",
  },
  {
    q: "¿Cómo contacto a soporte si tengo un problema?",
    a: "Podés escribirnos por WhatsApp tocando el botón de soporte al final de esta pantalla, o enviarnos un email a soporte@pideai.com. Respondemos en menos de 24 horas.",
  },
];

// ─── Component ───────────────────────────────────────────────────────────────

export default function HelpScreen() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const searchLower = search.toLowerCase();

  // Filter articles across all categories by search
  const filteredCategories = CATEGORIES.map((cat) => ({
    ...cat,
    articles: cat.articles.filter(
      (a) =>
        a.title.toLowerCase().includes(searchLower) ||
        a.steps.some((s) => s.toLowerCase().includes(searchLower))
    ),
  })).filter((cat) => cat.articles.length > 0);

  const filteredFaqs = FAQS.filter(
    (f) =>
      f.q.toLowerCase().includes(searchLower) ||
      f.a.toLowerCase().includes(searchLower)
  );

  const isSearching = search.length > 0;

  // ─── Article detail view ────────────────────────────────────────────────
  if (selectedArticle) {
    return (
      <ScrollView
        className="flex-1 bg-elegant-dark"
        contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
      >
        <TouchableOpacity
          className="flex-row items-center mb-4"
          onPress={() => setSelectedArticle(null)}
          activeOpacity={0.7}
        >
          <ChevronLeft size={20} color="#EB1C8D" />
          <Text className="text-brand-yellow font-sans-medium text-sm ml-1">
            Volver
          </Text>
        </TouchableOpacity>

        <Text className="text-white font-sans-bold text-lg mb-4">
          {selectedArticle.title}
        </Text>

        {/* Steps */}
        <View className="bg-elegant-gray rounded-xl p-4 mb-4">
          <Text className="text-cream-400 font-sans-semibold text-xs uppercase tracking-wider mb-3">
            Pasos
          </Text>
          {selectedArticle.steps.map((step, i) => (
            <View key={i} className="flex-row mb-2">
              <View className="w-6 h-6 rounded-full bg-brand-yellow/20 items-center justify-center mr-3 mt-0.5">
                <Text className="text-brand-yellow font-sans-bold text-xs">
                  {i + 1}
                </Text>
              </View>
              <Text className="text-cream-400 font-sans text-sm flex-1 leading-5">
                {step}
              </Text>
            </View>
          ))}
        </View>

        {/* Tip */}
        {selectedArticle.tip && (
          <View className="bg-elegant-gray rounded-xl p-4 mb-3 border-l-4 border-yellow-500">
            <Text className="text-white font-sans-medium text-sm mb-1">
              {"💡 Consejo"}
            </Text>
            <Text className="text-cream-400 font-sans text-sm leading-5">
              {selectedArticle.tip}
            </Text>
          </View>
        )}

        {/* Note */}
        {selectedArticle.note && (
          <View className="bg-elegant-gray rounded-xl p-4 mb-3 border-l-4 border-blue-500">
            <Text className="text-white font-sans-medium text-sm mb-1">
              {"ℹ️ Nota"}
            </Text>
            <Text className="text-cream-400 font-sans text-sm leading-5">
              {selectedArticle.note}
            </Text>
          </View>
        )}
      </ScrollView>
    );
  }

  // ─── Category articles list view ───────────────────────────────────────
  if (selectedCategory) {
    return (
      <ScrollView
        className="flex-1 bg-elegant-dark"
        contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
      >
        <TouchableOpacity
          className="flex-row items-center mb-4"
          onPress={() => setSelectedCategory(null)}
          activeOpacity={0.7}
        >
          <ChevronLeft size={20} color="#EB1C8D" />
          <Text className="text-brand-yellow font-sans-medium text-sm ml-1">
            Volver
          </Text>
        </TouchableOpacity>

        <View className="flex-row items-center gap-2 mb-4">
          {selectedCategory.icon}
          <Text className="text-white font-sans-bold text-lg">
            {selectedCategory.label}
          </Text>
        </View>

        {selectedCategory.articles.map((article) => (
          <TouchableOpacity
            key={article.id}
            className="bg-elegant-gray rounded-xl p-4 mb-2"
            style={{ borderLeftWidth: 3, borderLeftColor: selectedCategory.color }}
            onPress={() => setSelectedArticle(article)}
            activeOpacity={0.7}
          >
            <Text className="text-white font-sans-medium text-sm">
              {article.title}
            </Text>
            <Text className="text-cream-400 font-sans text-xs mt-1">
              {article.steps.length} pasos
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    );
  }

  // ─── Main view ─────────────────────────────────────────────────────────
  return (
    <ScrollView
      className="flex-1 bg-elegant-dark"
      contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
    >
      {/* Sofía Header */}
      <View className="bg-elegant-gray rounded-2xl p-4 mb-4 flex-row items-center gap-3">
        <View className="w-12 h-12 rounded-full bg-brand-yellow/20 items-center justify-center">
          <Sparkles size={24} color="#EB1C8D" />
        </View>
        <View className="flex-1">
          <Text className="text-white font-sans-bold text-base">
            Hola, soy Sofía
          </Text>
          <Text className="text-cream-400 font-sans text-xs">
            Asistente PideAI · ¿En qué puedo ayudarte?
          </Text>
        </View>
      </View>

      {/* Search */}
      <View className="bg-elegant-gray rounded-xl flex-row items-center px-3 mb-5">
        <Search size={18} color="#888" />
        <TextInput
          className="flex-1 text-white font-sans text-sm py-3 px-2"
          placeholder="Buscar artículos, preguntas..."
          placeholderTextColor="#888"
          value={search}
          onChangeText={setSearch}
          autoCorrect={false}
        />
      </View>

      {/* Categories or Search Results */}
      {isSearching ? (
        <>
          {/* Search results: articles */}
          {filteredCategories.map((cat) => (
            <View key={cat.id} className="mb-4">
              <View className="flex-row items-center gap-2 mb-2">
                {cat.icon}
                <Text className="text-cream-400 font-sans-semibold text-xs uppercase tracking-wider">
                  {cat.label}
                </Text>
              </View>
              {cat.articles.map((article) => (
                <TouchableOpacity
                  key={article.id}
                  className="bg-elegant-gray rounded-xl p-4 mb-2"
                  style={{ borderLeftWidth: 3, borderLeftColor: cat.color }}
                  onPress={() => {
                    setSelectedCategory(cat);
                    setSelectedArticle(article);
                  }}
                  activeOpacity={0.7}
                >
                  <Text className="text-white font-sans-medium text-sm">
                    {article.title}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          ))}

          {/* Search results: FAQs */}
          {filteredFaqs.length > 0 && (
            <View className="mb-4">
              <Text className="text-cream-400 font-sans-semibold text-xs uppercase tracking-wider mb-2">
                Preguntas frecuentes
              </Text>
              {filteredFaqs.map((faq, i) => (
                <View key={i} className="bg-elegant-gray rounded-xl p-4 mb-2">
                  <Text className="text-white font-sans-medium text-sm mb-1.5">
                    {faq.q}
                  </Text>
                  <Text className="text-cream-400 font-sans text-xs leading-5">
                    {faq.a}
                  </Text>
                </View>
              ))}
            </View>
          )}

          {filteredCategories.length === 0 && filteredFaqs.length === 0 && (
            <View className="items-center py-10">
              <Text className="text-cream-400 font-sans text-sm">
                No se encontraron resultados
              </Text>
            </View>
          )}
        </>
      ) : (
        <>
          {/* Category cards */}
          <Text className="text-cream-400 font-sans-semibold text-xs uppercase tracking-wider mb-3">
            Categorías
          </Text>
          <View className="flex-row flex-wrap justify-between mb-6">
            {CATEGORIES.map((cat) => (
              <TouchableOpacity
                key={cat.id}
                className="bg-elegant-gray rounded-xl p-4 mb-3"
                style={{
                  width: "48%",
                  borderLeftWidth: 3,
                  borderLeftColor: cat.color,
                }}
                onPress={() => setSelectedCategory(cat)}
                activeOpacity={0.7}
              >
                <View className="mb-2">{cat.icon}</View>
                <Text className="text-white font-sans-medium text-sm">
                  {cat.label}
                </Text>
                <Text className="text-cream-400 font-sans text-xs mt-0.5">
                  {cat.articles.length}{" "}
                  {cat.articles.length === 1 ? "artículo" : "artículos"}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* FAQs */}
          <Text className="text-cream-400 font-sans-semibold text-xs uppercase tracking-wider mb-3">
            Preguntas frecuentes
          </Text>
          {FAQS.map((faq, i) => (
            <TouchableOpacity
              key={i}
              className="bg-elegant-gray rounded-xl p-4 mb-2"
              onPress={() => setExpandedFaq(expandedFaq === i ? null : i)}
              activeOpacity={0.7}
            >
              <View className="flex-row items-center justify-between">
                <Text className="text-white font-sans-medium text-sm flex-1 pr-2">
                  {faq.q}
                </Text>
                {expandedFaq === i ? (
                  <ChevronUp size={16} color="#888" />
                ) : (
                  <ChevronDown size={16} color="#888" />
                )}
              </View>
              {expandedFaq === i && (
                <Text className="text-cream-400 font-sans text-xs leading-5 mt-3">
                  {faq.a}
                </Text>
              )}
            </TouchableOpacity>
          ))}
        </>
      )}

      {/* WhatsApp Support Button */}
      <TouchableOpacity
        className="bg-[#25D366] rounded-xl p-4 mt-6 flex-row items-center justify-center gap-2"
        onPress={() =>
          Linking.openURL(
            "https://wa.me/584121234567?text=Hola, necesito ayuda con PideAI"
          )
        }
        activeOpacity={0.7}
      >
        <MessageCircle size={20} color="#fff" />
        <Text className="text-white font-sans-bold text-sm">
          Contactar soporte por WhatsApp
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
