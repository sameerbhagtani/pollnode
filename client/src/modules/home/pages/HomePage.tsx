import { Link } from "react-router";
import type { ReactNode } from "react";
import {
    ArrowRight,
    BarChart3,
    Share2,
    Zap,
    LayoutDashboard,
    CheckCircle2,
} from "lucide-react";
import { Button } from "../../../shared/components/Button";
import { Card, CardContent } from "../../../shared/components/Card";
import { useAuth, SignInButton, SignUpButton } from "@clerk/react";

export default function HomePage() {
    const { isSignedIn } = useAuth();

    return (
        <div className="flex flex-col min-h-[calc(100vh-3.5rem)]">
            {/* Hero Section */}
            <section className="relative overflow-hidden pt-24 pb-32 flex flex-col items-center justify-center text-center px-4">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background -z-10" />

                <div className="animate-[pulse_3s_ease-in-out_infinite] mb-6 p-3 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-700 text-white shadow-lg">
                    <BarChart3 className="w-12 h-12" />
                </div>

                <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 max-w-4xl">
                    Live Polling,{" "}
                    <span className="bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent">
                        Evolved.
                    </span>
                </h1>

                <p className="text-xl text-muted-foreground mb-10 max-w-2xl leading-relaxed">
                    Create beautiful polls in seconds, share instantly, and
                    watch responses roll in real-time. Make decisions faster
                    with PollNode.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                    {isSignedIn ? (
                        <>
                            <Link to="/polls/new" className="w-full sm:w-auto">
                                <Button
                                    size="lg"
                                    className="w-full text-md h-12 px-8 bg-gradient-to-r from-emerald-500 to-emerald-700 border-0 text-white"
                                >
                                    Create a Poll
                                </Button>
                            </Link>
                            <Link to="/dashboard" className="w-full sm:w-auto">
                                <Button
                                    variant="outline"
                                    size="lg"
                                    className="w-full text-md h-12 px-8 border-2"
                                >
                                    View Dashboard
                                </Button>
                            </Link>
                        </>
                    ) : (
                        <>
                            <SignUpButton mode="modal">
                                <Button
                                    size="lg"
                                    className="w-full sm:w-auto text-md h-12 px-8 bg-gradient-to-r from-emerald-500 to-emerald-700 border-0 text-white shadow-lg hover:shadow-xl transition-all"
                                >
                                    Get Started for Free{" "}
                                    <ArrowRight className="w-4 h-4 ml-2" />
                                </Button>
                            </SignUpButton>
                            <SignInButton mode="modal">
                                <Button
                                    variant="outline"
                                    size="lg"
                                    className="w-full sm:w-auto text-md h-12 px-8 border-2"
                                >
                                    Sign In
                                </Button>
                            </SignInButton>
                        </>
                    )}
                </div>
            </section>

            {/* Features / Steps Section */}
            <section className="py-24 bg-muted/30 border-y">
                <div className="container mx-auto px-4 max-w-6xl">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold tracking-tight mb-4">
                            How PollNode Works
                        </h2>
                        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                            A seamless experience from creating your first
                            question to analyzing the final results.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        <StepCard
                            icon={
                                <LayoutDashboard className="w-6 h-6 text-blue-500" />
                            }
                            title="1. Create your poll"
                            description="Use our intuitive builder to craft single-choice questions with ease."
                            delay="0"
                        />
                        <StepCard
                            icon={
                                <Share2 className="w-6 h-6 text-emerald-500" />
                            }
                            title="2. Share the link"
                            description="Distribute the public link to your audience or team instantly."
                            delay="100"
                        />
                        <StepCard
                            icon={<Zap className="w-6 h-6 text-yellow-500" />}
                            title="3. Watch live"
                            description="See responses appear on your dashboard in real-time."
                            delay="200"
                        />
                        <StepCard
                            icon={
                                <CheckCircle2 className="w-6 h-6 text-green-500" />
                            }
                            title="4. Publish results"
                            description="Share the final analytics dashboard back with your participants."
                            delay="300"
                        />
                    </div>
                </div>
            </section>
        </div>
    );
}

function StepCard({
    icon,
    title,
    description,
    delay,
}: {
    icon: ReactNode;
    title: string;
    description: string;
    delay: string;
}) {
    return (
        <Card
            className="border border-white/60 dark:border-white/10 bg-white/80 dark:bg-slate-900/60 backdrop-blur-sm shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
            style={{ animationDelay: `${delay}ms` }}
        >
            <CardContent className="pt-8 text-center flex flex-col items-center">
                <div className="w-14 h-14 rounded-full bg-background shadow-sm flex items-center justify-center mb-6 border">
                    {icon}
                </div>
                <h3 className="text-xl font-semibold mb-3">{title}</h3>
                <p className="text-muted-foreground">{description}</p>
            </CardContent>
        </Card>
    );
}
