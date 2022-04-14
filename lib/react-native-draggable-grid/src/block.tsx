/** @format */

import * as React from 'react'

import { FunctionComponent, useEffect, useState } from 'react'

import {
    Animated,
    StyleProp,
    TouchableWithoutFeedback,
    StyleSheet,
    GestureResponderHandlers, Vibration,
} from 'react-native';
import ReactNativeHapticFeedback from "react-native-haptic-feedback";

const options = {
    enableVibrateFallback: true,
    ignoreAndroidSystemSettings: false
};
interface BlockProps {
    style?: StyleProp<any>
    dragStartAnimationStyle: StyleProp<any>
    onPress?: () => void
    onLongPress: () => void
    onLongPressMiddle?: () => void
    panHandlers: GestureResponderHandlers
}

export const Block: FunctionComponent<BlockProps> = ({
        style,
        dragStartAnimationStyle,
        onPress,
        onLongPress,
        onLongPressMiddle,
        children,
        panHandlers,
    }) => {
    const [time, setTime] = useState<number | null>(null)
    let interval: any
    useEffect(() => {

        if (time) {
            interval = setInterval(() => {
                if (Date.now() - time > 1000) {
                    ReactNativeHapticFeedback.trigger("impactLight", options);
                    setTime(null)
                    onLongPressMiddle && onLongPressMiddle()
                }
            })
        } else {
            clearInterval(interval)
        }
        return () => {
            clearInterval(interval)
        }
    }, [time])

    return (
        <Animated.View style={[styles.blockContainer, style, dragStartAnimationStyle]} {...panHandlers}>
            <Animated.View>
                <TouchableWithoutFeedback
                    delayLongPress={2500}
                    onPress={() => {
                        if (time) {
                            onPress && onPress()
                            setTime(null)
                        }
                    }}
                    onPressIn={() => {
                        setTime(Date.now())
                    }}
                    onPressOut={() =>{
                        if(Date.now() - time < 1000){
                            clearInterval(interval)
                        }
                    }}
                    onLongPress={() => {
                        ReactNativeHapticFeedback.trigger("impactLight", options);
                        setTime(null)
                        onLongPress()
                    }}
                >
                    {children}
                </TouchableWithoutFeedback>
            </Animated.View>
        </Animated.View>
    )
}

const styles = StyleSheet.create({
    blockContainer: {
        alignItems: 'center',
    },
})
