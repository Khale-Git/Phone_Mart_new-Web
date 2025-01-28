import 'package:flutter/material.dart';
import 'signin_page.dart';
import 'login_page.dart';
import 'products_page.dart';
import 'new_loader.dart';  // Import for the SciFiLoader

void main() => runApp(MyApp());

// Custom Route that shows loader
class LoadingPageRoute extends PageRouteBuilder {
  final Widget page;

  LoadingPageRoute({required this.page})
      : super(
          pageBuilder: (context, animation1, animation2) => page,
          transitionsBuilder: (context, animation1, animation2, child) {
            return FutureBuilder(
              future: Future.delayed(const Duration(seconds: 5)),
              builder: (context, snapshot) {
                if (snapshot.connectionState != ConnectionState.done) {
                  return const Scaffold(
                    body: Center(
                      child: SciFiLoader(), // Using your imported loader
                    ),
                  );
                }
                return FadeTransition(
                  opacity: animation1,
                  child: child,
                );
              },
            );
          },
        );
}

class MyApp extends StatefulWidget {
  const MyApp({super.key});

  @override
  _MyAppState createState() => _MyAppState();
}

class _MyAppState extends State<MyApp> {
  bool isDarkMode = false;

  void toggleTheme() {
    setState(() {
      isDarkMode = !isDarkMode;
    });
  }

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Phone Mart',
      theme: isDarkMode ? ThemeData.dark() : ThemeData.light(),
      home: HomePage(toggleTheme: toggleTheme),
      onGenerateRoute: (settings) {
        // Configure page transitions with loading screen
        Widget page;
        switch (settings.name) {
          case '/signin':
            page = const SignInPage();
            break;
          case '/login':
            page = const LogInPage();
            break;
          case '/products':
            page = const ProductsPage();
            break;
          default:
            page = HomePage(toggleTheme: toggleTheme);
        }
        return LoadingPageRoute(page: page);
      },
    );
  }
}

class HomePage extends StatelessWidget {
  final Function toggleTheme;

  const HomePage({required this.toggleTheme, super.key});

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: const BoxDecoration(
        image: DecorationImage(
          image: AssetImage('assets/background.jpg'),
          fit: BoxFit.cover,
        ),
      ),
      child: Scaffold(
        backgroundColor: Colors.transparent,
        appBar: AppBar(
          title: const Text('Phone Mart'),
          actions: [
            IconButton(
              icon: const Icon(Icons.brightness_6),
              onPressed: () => toggleTheme(),
            ),
          ],
        ),
        body: Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              ElevatedButton(
                onPressed: () {
                  Navigator.pushNamed(context, '/signin');
                },
                child: const Text('Sign Up'),
              ),
              const SizedBox(height: 8),
              ElevatedButton(
                onPressed: () {
                  Navigator.pushNamed(context, '/login');
                },
                child: const Text('Log In'),
              ),
            ],
          ),
        ),
      ),
    );
  }
}