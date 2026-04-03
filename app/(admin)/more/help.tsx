import { View, Text, ScrollView, TouchableOpacity, Linking } from "react-native";
import {
  HelpCircle,
  MessageCircle,
  Mail,
  ExternalLink,
  BookOpen,
  Video,
  Info,
} from "lucide-react-native";

interface HelpItem {
  icon: React.ReactNode;
  title: string;
  description: string;
  onPress: () => void;
}

export default function HelpScreen() {
  const helpItems: HelpItem[] = [
    {
      icon: <MessageCircle size={22} color="#22C55E" />,
      title: "Chat con soporte",
      description: "Escribinos por WhatsApp y te ayudamos al instante",
      onPress: () =>
        Linking.openURL("https://wa.me/584121234567?text=Hola, necesito ayuda con PideAI"),
    },
    {
      icon: <Mail size={22} color="#3B82F6" />,
      title: "Email de soporte",
      description: "Envianos un email y te respondemos en menos de 24h",
      onPress: () => Linking.openURL("mailto:soporte@pideai.com"),
    },
    {
      icon: <BookOpen size={22} color="#A855F7" />,
      title: "Centro de documentación",
      description: "Guías, tutoriales y preguntas frecuentes",
      onPress: () => Linking.openURL("https://pideai.com/docs"),
    },
    {
      icon: <Video size={22} color="#EF4444" />,
      title: "Video tutoriales",
      description: "Aprendé a usar PideAI con videos paso a paso",
      onPress: () => Linking.openURL("https://pideai.com/tutoriales"),
    },
  ];

  return (
    <ScrollView
      className="flex-1 bg-elegant-dark"
      contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
    >
      <View className="flex-row items-center gap-2 mb-2">
        <HelpCircle size={20} color="#FFC300" />
        <Text className="text-white font-sans-bold text-lg">
          Central de ayuda
        </Text>
      </View>

      <View className="flex-row items-start gap-1.5 mb-6">
        <Info size={12} color="#888" style={{ marginTop: 2 }} />
        <Text className="text-cream-400/60 font-sans text-xs flex-1">
          ¿Necesitás ayuda? Estamos acá para vos. Elegí el canal que más te
          convenga.
        </Text>
      </View>

      {helpItems.map((item, index) => (
        <TouchableOpacity
          key={index}
          className="bg-elegant-gray rounded-2xl p-4 mb-3 flex-row items-center"
          onPress={item.onPress}
          activeOpacity={0.7}
        >
          <View className="w-11 h-11 rounded-full bg-elegant-dark items-center justify-center mr-3">
            {item.icon}
          </View>
          <View className="flex-1">
            <Text className="text-white font-sans-medium text-sm">
              {item.title}
            </Text>
            <Text className="text-cream-400 font-sans text-xs mt-0.5">
              {item.description}
            </Text>
          </View>
          <ExternalLink size={16} color="#666" />
        </TouchableOpacity>
      ))}

      {/* FAQ Section */}
      <View className="mt-4 mb-3">
        <Text className="text-white font-sans-semibold text-sm mb-3">
          Preguntas frecuentes
        </Text>
      </View>

      <FAQItem
        question="¿Cómo recibo notificaciones de pedidos?"
        answer="Las notificaciones llegan automáticamente cuando un cliente hace un pedido. Asegurate de tener las notificaciones activadas en la configuración de tu celular. Podés configurar el sonido de alerta en Configuración → Avanzado."
      />
      <FAQItem
        question="¿Cómo cambio los horarios de mi tienda?"
        answer="Andá a Configuración → Horarios. Podés agregar múltiples turnos por día y forzar la apertura o cierre de la tienda."
      />
      <FAQItem
        question="¿Cómo agrego métodos de pago?"
        answer="En Configuración → Métodos de pago podés agregar Pago Móvil, Zelle, Binance u otros métodos. Tus clientes verán esta información al pagar."
      />
      <FAQItem
        question="¿Puedo ver mi tienda como la ven mis clientes?"
        answer="Sí, abrí el navegador de tu celular y visitá tu-tienda.pideai.com para ver la vista de cliente."
      />
    </ScrollView>
  );
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
  return (
    <View className="bg-elegant-gray rounded-xl p-4 mb-2">
      <Text className="text-white font-sans-medium text-sm mb-1.5">
        {question}
      </Text>
      <Text className="text-cream-400 font-sans text-xs leading-5">
        {answer}
      </Text>
    </View>
  );
}
