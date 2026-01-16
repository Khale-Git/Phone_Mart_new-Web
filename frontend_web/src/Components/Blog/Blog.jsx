import React, { useState, useEffect, useCallback } from 'react';
import { 
    Loader2, BookOpen, AlertTriangle, Link, Cpu, Smartphone, 
    ChevronRight, RefreshCw, Copy, Check 
} from 'lucide-react'; 
import './Blog.css';

// --- CONFIGURATION ---
// cerebras api key from environment variables
const CEREBRAS_API_KEY = import.meta.env.VITE_CEREBRAS_API_KEY;

// Sample videos showcasing Samsung's foldable design and performance

const VIDEO_DESIGN_URL = "https://images.samsung.com/africa_en/smartphones/galaxy-z-fold7/videos/galaxy-z-fold7-features-unveiling.webm?imbypass=true";
const VIDEO_PERF_URL = "https://images.samsung.com/is/content/samsung/assets/africa_en/smartphones/galaxy-z-fold7/videos/galaxy-z-fold7-features-highlights-ap_1.webm?imbypass=true";

const TOPIC = "Why Samsung is the top leading smartphone manufacturer and their strategy for 2026";
const AUTHOR = "Llama 3.3 70B, powered by Cerebras";
const MODEL_NAME = 'llama-3.3-70b';
const SYSTEM_PROMPT = "You are a professional, objective tech journalist writing for an e-commerce blog called 'PhoneMart Stories'. Write a detailed, engaging, and well-researched 1000-word analysis that addresses the topic. Focus heavily on hardware innovation (CPU/NPU/GPU) and the new foldable design aesthetics. Structure the response with clear headings (Markdown H2 and H3).";
const USER_PROMPT = `Write an article based on the following topic: "${TOPIC}"`;

const MOCK_CITATIONS = [
    { title: "Samsung Global Newsroom", uri: "https://news.samsung.com/global/" },
    { title: "Statista: Global Smartphone Market Share", uri: "https://www.statista.com/" },
    { title: "TechCrunch: The Foldable Future", uri: "https://techcrunch.com/" } 
];

// Helper to render markdown cleanly
const renderMarkdown = (markdownText) => {
    if (!markdownText) return null;
    const lines = markdownText.split('\n');
    const elements = [];
    let currentListItems = [];

    const flushList = (key) => {
        if (currentListItems.length > 0) {
            const isOrdered = currentListItems[0] && String(currentListItems[0].props.children[0]).match(/^\d+\./);
            const ListTag = isOrdered ? 'ol' : 'ul';
            elements.push(
                <ListTag key={key}>
                    {currentListItems.map((item, i) => (
                        <li key={i} dangerouslySetInnerHTML={{ __html: item.props.children }} />
                    ))}
                </ListTag>
            );
            currentListItems = [];
        }
    };

    const formatText = (text) => {
        return text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                   .replace(/\*(.*?)\*/g, '<em>$1</em>');
    };

    lines.forEach((line, index) => {
        let content = line.trim();
        if (content.startsWith('#### ')) {
            flushList(`list-${index}`);
            elements.push(<h4 key={index}>{content.substring(5).trim()}</h4>);
        } else if (content.startsWith('### ')) {
            flushList(`list-${index}`);
            elements.push(<h3 key={index}>{content.substring(4).trim()}</h3>);
        } else if (content.startsWith('## ')) {
            flushList(`list-${index}`);
            elements.push(<h2 key={index}>{content.substring(3).trim()}</h2>);
        } else {
            const listItemMatch = content.match(/^([\*\-+]|\d+\.)\s+(.*)/); 
            if (listItemMatch) {
                currentListItems.push(<span key={`item-${index}`} dangerouslySetInnerHTML={{ __html: formatText(listItemMatch[2].trim()) }} />);
            } else if (content.length > 0) {
                flushList(`list-${index}`);
                elements.push(<p key={index} dangerouslySetInnerHTML={{ __html: formatText(content) }} />);
            }
        }
    });
    flushList('final');
    return elements;
};

const Blog = () => {
    const [articleData, setArticleData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [copied, setCopied] = useState(false);

    const generateArticle = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch('https://api.cerebras.ai/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${CEREBRAS_API_KEY}`
                },
                body: JSON.stringify({
                    model: MODEL_NAME,
                    messages: [
                        { role: "system", content: SYSTEM_PROMPT },
                        { role: "user", content: USER_PROMPT }
                    ],
                    max_completion_tokens: 2000,
                    temperature: 0.8
                })
            });

            if (!response.ok) throw new Error(`API Error: ${response.status}`);
            const completion = await response.json();
            
            setArticleData({
                article: completion.choices?.[0]?.message?.content || "No content generated.",
                citations: MOCK_CITATIONS
            });
        } catch (err) {
            setError(err.message || "Failed to generate content.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        generateArticle();
    }, [generateArticle]);

    const handleCopy = () => {
        if (articleData?.article) {
            navigator.clipboard.writeText(articleData.article);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    // --- LOADING STATE ---
    if (loading && !articleData) {
        return (
            <div className="blog-container">
                <div className="blog-card" style={{ padding: '4rem', textAlign: 'center', display: 'flex', flexDirection: 'col', alignItems: 'center', justifyContent: 'center' }}>
                    <Loader2 className="animate-spin w-12 h-12 text-yellow-400 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-white">Consulting the AI...</h2>
                    <p className="text-gray-400 mt-2">Analyzing Samsung's 2026 roadmap</p>
                </div>
            </div>
        );
    }

    // --- ERROR STATE ---
    if (error) {
        return (
            <div className="blog-container">
                <div className="blog-card" style={{ padding: '3rem', textAlign: 'center', borderColor: '#ef4444' }}>
                    <AlertTriangle className="w-12 h-12 text-red-400 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-white">Generation Failed</h3>
                    <p className="text-red-200 mt-2">{error}</p>
                    <button onClick={generateArticle} className="retry-btn">
                        <RefreshCw size={16} style={{marginRight: 8}} /> Try Again
                    </button>
                </div>
            </div>
        );
    }

    const { article, citations } = articleData;

    return (
        <div className="blog-container">
            <div className="blog-card">
                
                {/* HEADER */}
                <header className="blog-header">
                    <div className="blog-header-top">
                        <div className="blog-meta">
                            <span style={{ color: '#fbbf24', fontWeight: 'bold' }}>TECH ANALYSIS</span>
                            <span>•</span>
                            <span>2026 OUTLOOK</span>
                        </div>
                        
                        {/* ACTION BUTTONS */}
                        <div className="header-actions">
                            <button onClick={handleCopy} className="icon-btn" title="Copy Article">
                                {copied ? <Check size={18} color="#4ade80" /> : <Copy size={18} />}
                            </button>
                            <button onClick={generateArticle} className="icon-btn" title="Regenerate" disabled={loading}>
                                <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
                            </button>
                        </div>
                    </div>

                    <h1>{TOPIC}</h1>
                    
                    <div className="blog-meta author-row">
                        <div className="w-8 h-8 rounded-full bg-yellow-600 flex items-center justify-center text-white font-bold text-xs shadow-lg">AI</div>
                        <div>
                            <p style={{ color: '#fff', margin: 0 }}>{AUTHOR}</p>
                            <p style={{ fontSize: '0.8rem', margin: 0 }}>{new Date().toLocaleDateString()} • 8 min read</p>
                        </div>
                    </div>
                </header>

                {/* HERO VIDEO */}
                <div className="media-container">
                    <video autoPlay muted loop playsInline controls>
                        <source src={VIDEO_DESIGN_URL} type="video/webm" />
                    </video>
                </div>

                {/* CONTENT */}
                <div className="blog-content">
                    {loading ? (
                         <div className="content-loader">
                            <Loader2 className="animate-spin w-8 h-8 text-yellow-400" />
                            <p>Refreshing content...</p>
                         </div>
                    ) : (
                        <article className="prose">
                            {renderMarkdown(article)}
                        </article>
                    )}

                    {/* SECONDARY VIDEO */}
                    <div className="media-container" style={{ position: 'relative' }}>
                        <div style={{ padding: '1rem', position: 'absolute', top: 0, left: 0, zIndex: 10, background: 'rgba(0,0,0,0.5)', width: '100%' }}>
                            <div style={{ display: 'flex', alignItems: 'center', color: '#fbbf24' }}>
                                <Cpu size={20} style={{ marginRight: '10px' }} />
                                <span style={{ fontWeight: 'bold', fontFamily: 'monospace' }}>NPU ACCELERATION</span>
                            </div>
                        </div>
                        <video autoPlay muted loop playsInline>
                            <source src={VIDEO_PERF_URL} type="video/webm" />
                        </video>
                    </div>

                    {/* FOOTER */}
                    <footer className="blog-footer">
                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1.5rem', color: '#fff' }}>
                            <BookOpen size={20} style={{ marginRight: '10px', color: '#fbbf24' }} />
                            <h4 style={{ margin: 0, fontSize: '1.2rem' }}>References & Grounding</h4>
                        </div>
                        <div className="citation-grid">
                            {citations.map((cite, idx) => (
                                <a key={idx} href={cite.uri} target="_blank" rel="noreferrer" className="citation-link group">
                                    <Link size={16} style={{ marginRight: '10px' }} />
                                    <span style={{ flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{cite.title}</span>
                                    <ChevronRight size={16} />
                                </a>
                            ))}
                        </div>
                    </footer>
                </div>
            </div>
        </div>
    );
};

export default Blog;