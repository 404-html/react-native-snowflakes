import React, { useState, useEffect } from 'react';
import { Animated, View, Dimensions, Easing } from 'react-native';

const Snowflake = (props) => {

	const { width, height } = Dimensions.get('window');
	let x = Math.round(Math.random() * (width));
	const [xAnim] = useState(new Animated.Value(x));
	const [yAnim] = useState(new Animated.Value(0));

	const lifeTime = 20000;
	const horizontalMoveDuringLifeTime = 6;
	const animationDelay = (lifeTime / props.total) * props.index;

	// Set of animations for horizontal snowflake bouncing
	const animations = [];
	const maxHorizontalMove = width / 10;
	for (let i = 0; i < horizontalMoveDuringLifeTime; i++) {
		const horizontalMove = Math.round(Math.random() * (maxHorizontalMove));
		x += (i % 2 === 0) ? horizontalMove : - horizontalMove;
		animations.push(Animated.timing(
			xAnim, {
			toValue: x,
			duration: lifeTime / horizontalMoveDuringLifeTime,
			delay: i === 0 ? animationDelay : 0
		}
		));
	}

	useEffect(() => {

		Animated.loop(
			Animated.timing(
				yAnim,
				{
					toValue: height + props.size * 2,
					duration: 20000,
					easing: Easing.linear,
					delay: animationDelay
				}
			)
		).start();

		Animated.loop(
			Animated.sequence(animations)
		).start();

	}, []);

	return (
		<Animated.Image
			style={{
				...props.style,
				position: 'absolute',
				left: xAnim,
				top: yAnim,
				height: props.size,
				width: props.size,
				opacity: .6
			}}
			source={require('./snowflake.png')}
			resizeMode="cover"
		>
		</Animated.Image>
	);
}

const Snowflakes = (props) => {

	if (props.snowOnlyAroundXmass) {
		const currentDate = new Date();
		if (currentDate.getMonth() !== 11 // 11 stands for December
			|| currentDate.getDate() < 18) {
			return null;
		}
	}

	const { width, height } = Dimensions.get('window');
	const sizeOfSnowflakes = props.sizeOfSnowflakes || (Math.max(width, height) / 35);
	const numberOfSnowflakes = props.numberOfSnowflakes || 10;
	return (
		<View pointerEvents="none" style={{
			flex: 1,
			position: 'absolute',
			width: '100%',
			top: -sizeOfSnowflakes,
			height: height + sizeOfSnowflakes
		}}>
			{[...Array(numberOfSnowflakes)].map((e, i) =>
				<Snowflake
					key={i}
					index={i}
					total={numberOfSnowflakes}
					size={sizeOfSnowflakes}
				/>)}
		</View>
	)
}

export default Snowflakes;