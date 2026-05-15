import { Link } from "react-router";
import { SignInButton, SignUpButton, UserButton, useUser } from "@clerk/react";
import { Button } from "./Button";
import { BarChart3 } from "lucide-react";

export function Header() {
    const { isSignedIn } = useUser();

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto px-4 h-14 flex items-center justify-between">
                <Link to="/" className="flex items-center space-x-2">
                    <BarChart3 className="h-6 w-6 text-primary" />
                    <span className="font-bold text-lg tracking-tight">
                        PollNode
                    </span>
                </Link>

                <nav className="flex items-center space-x-4">
                    {isSignedIn ? (
                        <>
                            <Link
                                to="/dashboard"
                                className="text-sm font-medium hover:text-primary transition-colors"
                            >
                                Dashboard
                            </Link>
                            <UserButton />
                        </>
                    ) : (
                        <>
                            <SignInButton mode="modal">
                                <Button variant="ghost" size="sm">
                                    Sign In
                                </Button>
                            </SignInButton>
                            <SignUpButton mode="modal">
                                <Button
                                    size="sm"
                                    className="bg-gradient-to-r from-emerald-500 to-emerald-700 text-white border-0"
                                >
                                    Get Started
                                </Button>
                            </SignUpButton>
                        </>
                    )}
                </nav>
            </div>
        </header>
    );
}
