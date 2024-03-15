  const { confirmPayment, loading: confirmLoading } = useConfirmPayment();
    const [loading, setLoading] = useState(false);
  
    const handlePayPress = async () => {
      if (!email) {
        Alert.alert("Error", "Please enter your email address.");
        return;
      }
      setLoading(true);
  
      // Assuming your backend is set up to calculate the amount
      // and possibly apply discounts, taxes, etc, based on the email or user ID
      try {
        const response = await fetch(`${API_URL}/create-payment-intent`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }), // Sending email to server to create a PaymentIntent
        });
  
        const { clientSecret, error } = await response.json();
  
        if (error) {
          Alert.alert("Error", error.message);
          setLoading(false);
          return;
        }
  
        const { error: stripeError } = await confirmPayment(clientSecret, {
          type: "Card",
          billingDetails: { email },
        });
  
        if (stripeError) {
          Alert.alert("Payment failed", stripeError.message);
        } else {
          Alert.alert("Payment Successful", "Thank you for your payment!");
          // Navigate to a confirmation screen or update state as needed
        }
      } catch (error) {
        Alert.alert("Payment error", "An error occurred while attempting to make the payment.");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
  return (
    <ScrollView style={{ flex: 1 }}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={24} color={Colors.BLACK} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Payment</Text>
        </View>
        <View style={styles.subContainer}>
          <TextInput
           autoCapitalize="none"
           placeholder="E-mail"
           value={email}
           onChangeText={setEmail}
           style={styles.input}
          />
          <CardForm
            postalCodeEnabled={true}
            onFormComplete={(cardDetails) => {
                console.log('Card details updated', cardDetails);
              }}
              style={styles.card}
          />
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              onPress={handlePayPress}
              style={styles.customButton}
              disabled={confirmLoading || loading}>
              <Text style={styles.buttonText}>Pay</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    marginBottom: 20,
    marginLeft: 15,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.BLACK,
    padding: 15,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    margin: 10,
  },
  subContainer: {
    flex: 1,
    justifyContent: "center",
    margin: 10,
  },
  customButton: {
    backgroundColor: Colors.PRIMARY_OPACITY,
    padding: 8, // Reduced padding
    borderRadius: 4,
    alignItems: "center",
    justifyContent: "center",
    width: 100, // Explicit width
    height: 40,
  },
  buttonContainer: {
    alignItems: "flex-end", // Align button to the right
    marginRight: 20, // Optional: Adjust the margin to position the button as desired
  },
  buttonText: {
    color: Colors.GRAY, // Example button text color
    fontSize: 16,
    // Add more styling as needed
  },
  input: {
    backgroundColor: "#FCDEE7",
    overflow: "hidden",
    borderRadius: 10,
    height: 50,
    padding: 10,
  },
  card: {
    width: "100%",
    height: 170,
    marginVertical: 20,
    backgroundColor: "FCDEE7",
    borderRadius: 10,
  },
  cardContainer: {
    backgroundColor: "#FCDEE7",
    borderRadius: 10,
  },
});
