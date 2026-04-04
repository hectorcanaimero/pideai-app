import { Component, type ReactNode } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { AlertTriangle, RefreshCw } from "lucide-react-native";
import { captureError } from "@/lib/sentry";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error("ErrorBoundary caught:", error, errorInfo);
    captureError(error, { componentStack: errorInfo?.componentStack });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;

      return (
        <View className="flex-1 items-center justify-center bg-elegant-dark px-8">
          <AlertTriangle size={48} color="#EF4444" />
          <Text className="text-text-primary font-sans-bold text-lg mt-4 text-center">
            Algo salió mal
          </Text>
          <Text className="text-cream-400 font-sans text-sm mt-2 text-center">
            {this.state.error?.message ?? "Error inesperado"}
          </Text>
          <TouchableOpacity
            className="bg-gold-500 px-6 py-3 rounded-xl mt-6 flex-row items-center gap-2"
            onPress={this.handleReset}
            activeOpacity={0.8}
          >
            <RefreshCw size={16} color="#FFFFFF" />
            <Text className="text-text-inverted font-sans-bold text-sm">Reintentar</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return this.props.children;
  }
}
