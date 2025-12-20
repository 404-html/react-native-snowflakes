import React, { useState, useEffect } from "react";
import { Animated, View, Dimensions, Easing } from "react-native";

const Snowflake = (props) => {
  const { width, height } = Dimensions.get("window");
  let x = Math.round(Math.random() * width);
  const [xAnim] = useState(new Animated.Value(x));

  // Start off-screen (above the visible area) at a random offset so flakes aren't visible
  const initialY = -Math.round(
    Math.random() * (height + (props.size || 0) * 2)
  );
  const [yAnim] = useState(new Animated.Value(initialY));

  // Rotation: random start angle, direction and slow duration
  const startRotation = Math.round(Math.random() * 360);
  const rotationDirection = Math.random() < 0.5 ? 1 : -1;
  const rotationDuration = 20000 + Math.round(Math.random() * 20000); // 20-40s slow rotation
  const rotationOutput = rotationDirection === 1 ? "360deg" : "-360deg";
  const [rotationAnim] = useState(new Animated.Value(0));

  const lifeTime = 20000;
  const horizontalMoveDuringLifeTime = 6;
  // Base delay spreads flakes evenly, then add a random jitter so they won't all start simultaneously
  const baseDelay = (lifeTime / (props.total || 1)) * props.index;
  const animationDelay = Math.floor(
    baseDelay + Math.random() * (lifeTime / Math.max(1, props.total || 1))
  );

  // Compute a duration proportional to remaining travel distance so flakes that start higher take longer
  const travelDistance = height + (props.size || 0) * 2 - initialY;
  const duration = Math.max(
    8000,
    Math.round((travelDistance / (height + (props.size || 0) * 2)) * lifeTime)
  );

  // Set of animations for horizontal snowflake bouncing
  const animations = [];
  const maxHorizontalMove = width / 10;
  for (let i = 0; i < horizontalMoveDuringLifeTime; i++) {
    const horizontalMove = Math.round(Math.random() * maxHorizontalMove);
    x += i % 2 === 0 ? horizontalMove : -horizontalMove;
    animations.push(
      Animated.timing(xAnim, {
        toValue: x,
        duration: lifeTime / horizontalMoveDuringLifeTime,
        delay: i === 0 ? animationDelay : 0,
        useNativeDriver: true,
      })
    );
  }

  useEffect(() => {
    Animated.loop(
      Animated.timing(yAnim, {
        toValue: height + props.size * 2,
        duration: duration,
        easing: Easing.linear,
        delay: animationDelay,
        useNativeDriver: true,
      })
    ).start();

    Animated.loop(Animated.sequence(animations)).start();

    // Slow continuous rotation with its own random speed/direction and start delay
    Animated.loop(
      Animated.timing(rotationAnim, {
        toValue: 360,
        duration: rotationDuration,
        easing: Easing.linear,
        delay: animationDelay,
        useNativeDriver: true,
      }),
      { iterations: -1 }
    ).start();
  }, []);

  return (
    <Animated.Image
      style={{
        ...props.style,
        position: "absolute",
        transform: [
          { translateX: xAnim },
          { translateY: yAnim },
          // start at a random rotation and then slowly spin (direction randomized)
          { rotate: `${startRotation}deg` },
          {
            rotate: rotationAnim.interpolate({
              inputRange: [0, 360],
              outputRange: ["0deg", rotationOutput],
            }),
          },
        ],
        height: props.size,
        width: props.size,
        opacity: 0.6,
      }}
      source={require("./snowflake.png")}
      resizeMode="cover"
    ></Animated.Image>
  );
};

const Snowflakes = (props) => {
  if (props.snowOnlyAroundXmass) {
    const currentDate = new Date();
    if (
      currentDate.getMonth() !== 11 || // 11 stands for December
      currentDate.getDate() < 18
    ) {
      return null;
    }
  }

  const { width, height } = Dimensions.get("window");
  const sizeOfSnowflakes =
    props.sizeOfSnowflakes || Math.max(width, height) / 35;
  const numberOfSnowflakes = props.numberOfSnowflakes || 10;
  return (
    <View
      pointerEvents="none"
      style={{
        flex: 1,
        position: "absolute",
        width: "100%",
        top: 0,
        height: height + sizeOfSnowflakes,
      }}
    >
      {[...Array(numberOfSnowflakes)].map((e, i) => (
        <Snowflake
          key={i}
          index={i}
          total={numberOfSnowflakes}
          size={sizeOfSnowflakes}
        />
      ))}
    </View>
  );
};

export default Snowflakes;
