import {
  Text,
  View,
  TouchableOpacity,
  TextInput,
} from "proton-native"; // import the proton-native components

class CircleButton extends Component {
  render() {
    return (
      <TouchableOpacity
        style={{
          backgroundColor: this.props.backgroundColor,
          borderRadius: 40,
          height: 80,
          width: this.props.width || 80,
          alignItems: this.props.start ? "flex-start" : "center",
          justifyContent: "center",
        }}
        onPress={this.props.onPress}
      >
        <Text
          style={{
            color: this.props.color,
            fontSize: this.props.size,
            marginLeft: this.props.start ? 25 : 0,
          }}
        >
          {this.props.children}
        </Text>
      </TouchableOpacity>
    );
  }
}

const buttonStyle = {
  primary: {
    backgroundColor: "#FC9E34",
    color: "white",
    size: 40,
  },
  secondary: {
    backgroundColor: "#A4A4A4",
    color: "#010101",
    size: 30,
  },
  number: {
    backgroundColor: "#363636",
    color: "white",
    size: 40,
  },
};
