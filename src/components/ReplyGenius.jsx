import React, { useState, useRef, useEffect } from 'react';

// Custom SVG Icons
const Send = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
  </svg>
);

const Mail = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 7.89a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);

const Sparkles = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3l1.5 1.5L5 6M19 3l-1.5 1.5L19 6M12 2v4M12 18v4M20.5 12H16M8 12H3.5M17.5 17.5L16 16M8 8L6.5 6.5M17.5 6.5L16 8M8 16L6.5 17.5" />
  </svg>
);

const Zap = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
  </svg>
);

const Shield = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
);

const Clock = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const Copy = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
  </svg>
);

const Check = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
);

const ArrowRight = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
  </svg>
);

const MailLarge = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 7.89a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);

const ReplyGenius = () => {
  const [email, setEmail] = useState('');
  const [tone, setTone] = useState('professional');
  const [length, setLength] = useState('medium');
  const [reply, setReply] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const textareaRef = useRef(null);

  // Get API key from environment variables
  const API_KEY = process.env.REACT_APP_OPENAI_API_KEY;

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [email]);

  const generateReply = async () => {
    if (!email.trim()) {
      alert('Please enter an email to reply to');
      return;
    }

    setIsGenerating(true);
    setReply('');

    try {
      const prompt = `Generate a ${tone} email reply in ${length} length to the following email. Make it natural and contextually appropriate:\n\n${email}`;
      
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_KEY}`
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: `You are an expert email assistant. Generate ${tone} email replies that are ${length} in length. Make them natural, contextually appropriate, and professional.`
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.7,
          max_tokens: length === 'short' ? 150 : length === 'medium' ? 300 : 500
        })
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const data = await response.json();
      setReply(data.choices[0].message.content);
    } catch (error) {
      console.error('Error generating reply:', error);
      // Fallback demo response for testing
      setReply(`Thank you for your email. I appreciate you reaching out and will get back to you shortly with a detailed response. 

Best regards,
[Your Name]`);
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(reply);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const features = [
    {
      icon: <Sparkles />,
      title: "AI-Powered Intelligence",
      description: "Generate contextually relevant email replies using advanced AI technology"
    },
    {
      icon: <Zap />,
      title: "Lightning Fast",
      description: "Get professional email replies in seconds, not minutes"
    },
    {
      icon: <Shield />,
      title: "Multiple Tones",
      description: "Choose from professional, casual, friendly, or formal tones"
    },
    {
      icon: <Clock />,
      title: "Save Time",
      description: "Reduce email response time by up to 90% with smart automation"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white overflow-x-hidden cursor-pointer" 
         style={{
           cursor: "url('data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"%23ff6b35\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M12 19l7-7 3 3-7 7-3-3z\"/><path d=\"M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z\"/><path d=\"M2 2l7.586 7.586\"/><circle cx=\"11\" cy=\"11\" r=\"2\"/></svg>') 12 12, auto"
         }}>
      
      {/* Custom Styles */}
      <style jsx>{`
        /* Hide scrollbars */
        ::-webkit-scrollbar {
          width: 0px;
          background: transparent;
        }
        
        * {
          scrollbar-width: none;
          -ms-overflow-style: none;
        }

        /* Glowing animations */
        @keyframes glow {
          0%, 100% { box-shadow: 0 0 20px rgba(255, 107, 53, 0.3); }
          50% { box-shadow: 0 0 30px rgba(255, 107, 53, 0.6); }
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }

        .glow-orange {
          animation: glow 2s ease-in-out infinite;
        }

        .float-animation {
          animation: float 3s ease-in-out infinite;
        }

        .fade-in-up {
          animation: fadeInUp 0.8s ease-out;
        }

        .slide-in-left {
          animation: slideInLeft 0.8s ease-out;
        }

        .slide-in-right {
          animation: slideInRight 0.8s ease-out;
        }

        .pulse-animation {
          animation: pulse 2s ease-in-out infinite;
        }

        /* Custom button hover effects */
        .btn-hover {
          position: relative;
          overflow: hidden;
          transition: all 0.3s ease;
        }

        .btn-hover::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
          transition: left 0.5s;
        }

        .btn-hover:hover::before {
          left: 100%;
        }

        /* Typing animation */
        .typing::after {
          content: '|';
          animation: pulse 1s infinite;
        }
      `}</style>

      {/* Header */}
      <header className="border-b border-orange-900/30 bg-black/50 backdrop-blur-xl fade-in-up">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-center">
            <div className="flex items-center space-x-4 float-animation">
              <div className="bg-gradient-to-r from-orange-500 to-red-600 p-3 rounded-xl glow-orange">
                <Mail />
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-400 via-orange-500 to-red-500 bg-clip-text text-transparent">
                ReplyGenius
              </h1>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 fade-in-up">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-6xl md:text-7xl font-bold mb-8 bg-gradient-to-r from-white via-orange-200 to-orange-400 bg-clip-text text-transparent leading-tight">
            Generate Perfect Email Replies with AI
          </h2>
          <p className="text-xl text-gray-300 mb-16 max-w-3xl mx-auto leading-relaxed">
            Transform any email into a professional, contextually appropriate response in seconds. 
            Powered by advanced AI technology that understands context and tone.
          </p>
          
          {/* Animated floating elements */}
          <div className="absolute top-20 left-10 w-20 h-20 bg-orange-500/10 rounded-full blur-xl float-animation"></div>
          <div className="absolute top-40 right-20 w-32 h-32 bg-red-500/10 rounded-full blur-xl float-animation" style={{animationDelay: '1s'}}></div>
        </div>
      </section>

      {/* Main Tool */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="bg-gradient-to-br from-gray-900/80 via-black/60 to-gray-800/80 backdrop-blur-xl border border-orange-500/20 rounded-3xl p-10 shadow-2xl glow-orange fade-in-up">
            <div className="grid lg:grid-cols-2 gap-12">
              
              {/* Input Section */}
              <div className="space-y-8 slide-in-left">
                <div className="transform transition-all duration-500 hover:scale-105">
                  <label className="block text-lg font-semibold mb-4 text-orange-300">
                    Email to Reply To
                  </label>
                  <textarea
                    ref={textareaRef}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Paste the email you want to reply to here..."
                    className="w-full px-6 py-4 bg-black/40 border-2 border-orange-500/30 rounded-xl focus:ring-4 focus:ring-orange-500/30 focus:border-orange-500 resize-none min-h-[240px] text-gray-100 placeholder-gray-400 transition-all duration-300 hover:border-orange-500/50"
                    style={{scrollbarWidth: 'none', msOverflowStyle: 'none'}}
                  />
                </div>

                {/* Controls */}
                <div className="grid grid-cols-2 gap-6">
                  <div className="transform transition-all duration-300 hover:scale-105">
                    <label className="block text-sm font-semibold mb-3 text-orange-300">Tone</label>
                    <select
                      value={tone}
                      onChange={(e) => setTone(e.target.value)}
                      className="w-full px-4 py-3 bg-black/60 border-2 border-orange-500/30 rounded-xl focus:ring-4 focus:ring-orange-500/30 text-gray-100 transition-all duration-300 hover:border-orange-500/50"
                    >
                      <option value="professional">Professional</option>
                      <option value="casual">Casual</option>
                      <option value="friendly">Friendly</option>
                      <option value="formal">Formal</option>
                    </select>
                  </div>
                  <div className="transform transition-all duration-300 hover:scale-105">
                    <label className="block text-sm font-semibold mb-3 text-orange-300">Length</label>
                    <select
                      value={length}
                      onChange={(e) => setLength(e.target.value)}
                      className="w-full px-4 py-3 bg-black/60 border-2 border-orange-500/30 rounded-xl focus:ring-4 focus:ring-orange-500/30 text-gray-100 transition-all duration-300 hover:border-orange-500/50"
                    >
                      <option value="short">Short</option>
                      <option value="medium">Medium</option>
                      <option value="long">Long</option>
                    </select>
                  </div>
                </div>

                <button
                  onClick={generateReply}
                  disabled={isGenerating || !email.trim()}
                  className="w-full bg-gradient-to-r from-orange-600 via-orange-500 to-red-600 hover:from-orange-500 hover:via-orange-400 hover:to-red-500 disabled:from-gray-700 disabled:to-gray-600 text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 flex items-center justify-center space-x-3 disabled:cursor-not-allowed btn-hover transform hover:scale-105 hover:shadow-2xl"
                >
                  {isGenerating ? (
                    <>
                      <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span className="typing">Generating</span>
                    </>
                  ) : (
                    <>
                      <Send />
                      <span>Generate Reply</span>
                    </>
                  )}
                </button>
              </div>

              {/* Output Section */}
              <div className="space-y-6 slide-in-right">
                <div className="flex items-center justify-between">
                  <label className="block text-lg font-semibold text-orange-300">
                    Generated Reply
                  </label>
                  {reply && (
                    <button
                      onClick={copyToClipboard}
                      className="flex items-center space-x-2 text-sm text-orange-400 hover:text-orange-300 transition-all duration-300 transform hover:scale-110 px-3 py-1 rounded-lg hover:bg-orange-500/10"
                    >
                      {copied ? <Check /> : <Copy />}
                      <span>{copied ? 'Copied!' : 'Copy'}</span>
                    </button>
                  )}
                </div>
                <div className="bg-black/40 border-2 border-orange-500/30 rounded-xl p-6 min-h-[350px] max-h-[450px] overflow-y-auto transition-all duration-300 hover:border-orange-500/50"
                     style={{scrollbarWidth: 'none', msOverflowStyle: 'none'}}>
                  {reply ? (
                    <div className="whitespace-pre-wrap text-gray-100 leading-relaxed fade-in-up">
                      {reply}
                    </div>
                  ) : (
                    <div className="text-gray-400 italic text-center flex items-center justify-center h-full pulse-animation">
                      Your AI-generated reply will appear here
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20 fade-in-up">
            <h3 className="text-4xl font-bold mb-6 bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">Why Choose ReplyGenius?</h3>
            <p className="text-gray-400 text-xl">Streamline your email workflow with intelligent automation</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} 
                   className="bg-gradient-to-br from-black/60 to-gray-900/60 border border-orange-500/20 rounded-2xl p-8 text-center hover:bg-gradient-to-br hover:from-orange-500/10 hover:to-red-500/10 transition-all duration-500 transform hover:scale-105 hover:border-orange-500/50 fade-in-up"
                   style={{animationDelay: `${index * 0.2}s`}}>
                <div className="bg-gradient-to-r from-orange-500 to-red-600 w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-6 glow-orange">
                  {feature.icon}
                </div>
                <h4 className="text-xl font-bold mb-4 text-orange-300">{feature.title}</h4>
                <p className="text-gray-400 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto text-center fade-in-up">
          <div className="bg-gradient-to-r from-orange-900/30 via-black/50 to-red-900/30 border border-orange-500/30 rounded-3xl p-12 glow-orange">
            <h3 className="text-4xl font-bold mb-6 bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">Ready to Transform Your Email Game?</h3>
            <p className="text-gray-300 mb-8 text-lg leading-relaxed">
              Join thousands of professionals who save hours every week with AI-powered email replies
            </p>
            <button
              onClick={() => document.querySelector('textarea').focus()}
              className="bg-gradient-to-r from-orange-600 via-orange-500 to-red-600 hover:from-orange-500 hover:via-orange-400 hover:to-red-500 text-white font-bold py-4 px-10 rounded-xl transition-all duration-300 flex items-center justify-center space-x-3 mx-auto btn-hover transform hover:scale-110 hover:shadow-2xl"
            >
              <span>Get Started Now</span>
              <ArrowRight />
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-orange-900/30 py-12 px-4 sm:px-6 lg:px-8 fade-in-up">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-4 mb-6 float-animation">
            <div className="bg-gradient-to-r from-orange-500 to-red-600 p-3 rounded-xl glow-orange">
              <MailLarge />
            </div>
            <span className="text-xl font-bold text-orange-300">ReplyGenius</span>
          </div>
          <p className="text-gray-400">
            Powered by OpenAI GPT • Built with ❤️ for productivity
          </p>
        </div>
      </footer>
    </div>
  );
};

export default ReplyGenius;