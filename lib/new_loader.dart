import 'package:flutter/material.dart';
import 'dart:math' as math;

class SciFiLoader extends StatefulWidget {
  const SciFiLoader({Key? key}) : super(key: key);

  @override
  _SciFiLoaderState createState() => _SciFiLoaderState();
}

class _SciFiLoaderState extends State<SciFiLoader> with TickerProviderStateMixin {
  late AnimationController _rotationController;
  late AnimationController _reverseRotationController;
  late AnimationController _pulseController;
  late AnimationController _scanLineController;

  @override
  void initState() {
    super.initState();
    
    // Rotation animation for outer ring
    _rotationController = AnimationController(
      duration: const Duration(seconds: 3),
      vsync: this,
    )..repeat();

    // Reverse rotation for inner ring
    _reverseRotationController = AnimationController(
      duration: const Duration(seconds: 2),
      vsync: this,
    )..repeat();

    // Pulse animation
    _pulseController = AnimationController(
      duration: const Duration(milliseconds: 1500),
      vsync: this,
    )..repeat(reverse: true);

    // Scan line animation
    _scanLineController = AnimationController(
      duration: const Duration(seconds: 2),
      vsync: this,
    )..repeat(reverse: true);
  }

  @override
  void dispose() {
    _rotationController.dispose();
    _reverseRotationController.dispose();
    _pulseController.dispose();
    _scanLineController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: 256, // equivalent to w-64
      height: 256,
      child: Stack(
        alignment: Alignment.center,
        children: [
          // Outer rotating ring
          AnimatedBuilder(
            animation: _rotationController,
            builder: (context, child) {
              return Transform.rotate(
                angle: _rotationController.value * 2 * math.pi,
                child: Container(
                  width: 192, // equivalent to w-48
                  height: 192,
                  decoration: BoxDecoration(
                    shape: BoxShape.circle,
                    border: Border.all(
                      color: Colors.cyanAccent.withOpacity(0.3),
                      width: 4,
                    ),
                  ),
                ),
              );
            },
          ),

          // Inner rotating ring
          AnimatedBuilder(
            animation: _reverseRotationController,
            builder: (context, child) {
              return Transform.rotate(
                angle: -_reverseRotationController.value * 2 * math.pi,
                child: Container(
                  width: 128, // equivalent to w-32
                  height: 128,
                  decoration: BoxDecoration(
                    shape: BoxShape.circle,
                    border: Border.all(
                      color: Colors.blue.withOpacity(0.4),
                      width: 4,
                    ),
                  ),
                ),
              );
            },
          ),

          // Pulsing core
          AnimatedBuilder(
            animation: _pulseController,
            builder: (context, child) {
              return Container(
                width: 64, // equivalent to w-16
                height: 64,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  color: Colors.blue.withOpacity(0.2 + (_pulseController.value * 0.2)),
                ),
                child: Stack(
                  children: [
                    Container(
                      decoration: BoxDecoration(
                        shape: BoxShape.circle,
                        color: Colors.blue.withOpacity(0.4 + (_pulseController.value * 0.2)),
                      ),
                    ),
                    Container(
                      decoration: BoxDecoration(
                        shape: BoxShape.circle,
                        color: Colors.cyanAccent.withOpacity(0.6 + (_pulseController.value * 0.2)),
                      ),
                    ),
                  ],
                ),
              );
            },
          ),

          // Scanning line
          AnimatedBuilder(
            animation: _scanLineController,
            builder: (context, child) {
              return Positioned(
                top: _scanLineController.value * 256,
                child: Container(
                  width: 256,
                  height: 4,
                  decoration: BoxDecoration(
                    gradient: LinearGradient(
                      colors: [
                        Colors.transparent,
                        Colors.cyanAccent.withOpacity(0.5),
                        Colors.transparent,
                      ],
                    ),
                  ),
                ),
              );
            },
          ),

          // Corner elements
          ...List.generate(4, (index) {
            final rotation = index * 90.0;
            return Transform.translate(
              offset: Offset(
                88 * math.cos((rotation - 45) * math.pi / 180),
                88 * math.sin((rotation - 45) * math.pi / 180),
              ),
              child: Transform.rotate(
                angle: rotation * math.pi / 180,
                child: Container(
                  width: 32, // equivalent to w-8
                  height: 32,
                  decoration: BoxDecoration(
                    border: Border(
                      top: BorderSide(color: Colors.cyanAccent, width: 2),
                      left: BorderSide(color: Colors.cyanAccent, width: 2),
                    ),
                  ),
                ),
              ),
            );
          }),

          // Loading text
          Positioned(
            bottom: -32,
            child: AnimatedBuilder(
              animation: _pulseController,
              builder: (context, child) {
                return Opacity(
                  opacity: 0.5 + (_pulseController.value * 0.5),
                  child: Text(
                    'LOADING...',
                    style: TextStyle(
                      color: Colors.cyanAccent,
                      fontFamily: 'monospace',
                      fontSize: 14,
                      letterSpacing: 4,
                    ),
                  ),
                );
              },
            ),
          ),
        ],
      ),
    );
  }
}