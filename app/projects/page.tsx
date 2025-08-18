'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import Navigation from '@/components/Navigation'
import { 
  Github, 
  ExternalLink, 
  Shield, 
  Code, 
  Search, 
  Zap,
  Lock,
  Eye,
  Terminal,
  Database,
  Globe,
  Smartphone
} from 'lucide-react'

export default function Projects() {
  const [projectsRef, projectsInView] = useInView({ triggerOnce: true, threshold: 0.1 })

  const projects = [
    {
      title: "Network Vulnerability Scanner",
      description: "Advanced network scanning tool that identifies security vulnerabilities, open ports, and potential attack vectors in network infrastructure.",
      category: "Cybersecurity",
      technologies: ["Python", "Nmap", "SQLite", "Flask"],
      image: "/api/placeholder/400/250",
      github: "#",
      live: "#",
      icon: Shield,
      featured: true
    },
    {
      title: "Web Application Firewall",
      description: "Real-time web application firewall that protects against common web attacks including SQL injection, XSS, and CSRF.",
      category: "Security Tool",
      technologies: ["Node.js", "Express", "Redis", "Docker"],
      image: "/api/placeholder/400/250",
      github: "#",
      live: "#",
      icon: Lock,
      featured: true
    },
    {
      title: "Malware Analysis Platform",
      description: "Automated malware analysis system that performs static and dynamic analysis of suspicious files and generates detailed reports.",
      category: "Security Research",
      technologies: ["Python", "Cuckoo Sandbox", "MongoDB", "React"],
      image: "/api/placeholder/400/250",
      github: "#",
      live: "#",
      icon: Search,
      featured: false
    },
    {
      title: "Secure Password Manager",
      description: "End-to-end encrypted password manager with biometric authentication and secure sharing capabilities.",
      category: "Security Tool",
      technologies: ["React", "Node.js", "PostgreSQL", "AES-256"],
      image: "/api/placeholder/400/250",
      github: "#",
      live: "#",
      icon: Lock,
      featured: false
    },
    {
      title: "Penetration Testing Framework",
      description: "Comprehensive penetration testing framework with automated exploit modules and reporting capabilities.",
      category: "Cybersecurity",
      technologies: ["Python", "Metasploit", "SQLite", "CLI"],
      image: "/api/placeholder/400/250",
      github: "#",
      live: "#",
      icon: Terminal,
      featured: false
    },
    {
      title: "Security Dashboard",
      description: "Real-time security monitoring dashboard that aggregates data from multiple security tools and provides actionable insights.",
      category: "Security Tool",
      technologies: ["React", "D3.js", "WebSocket", "Node.js"],
      image: "/api/placeholder/400/250",
      github: "#",
      live: "#",
      icon: Eye,
      featured: false
    },
    {
      title: "API Security Testing Tool",
      description: "Automated API security testing tool that identifies vulnerabilities in REST and GraphQL APIs.",
      category: "Security Research",
      technologies: ["Python", "FastAPI", "JWT", "PostgreSQL"],
      image: "/api/placeholder/400/250",
      github: "#",
      live: "#",
      icon: Globe,
      featured: false
    },
    {
      title: "Mobile Security Scanner",
      description: "Android and iOS security scanner that analyzes mobile applications for security vulnerabilities and compliance issues.",
      category: "Mobile Security",
      technologies: ["React Native", "Python", "Docker", "MongoDB"],
      image: "/api/placeholder/400/250",
      github: "#",
      live: "#",
      icon: Smartphone,
      featured: false
    }
  ]

  const categories = ["All", "Cybersecurity", "Security Tool", "Security Research", "Mobile Security"]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              My <span className="gradient-text">Projects</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              A collection of cybersecurity tools, security research projects, and innovative solutions 
              I've developed to address real-world security challenges.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Projects Grid */}
      <section ref={projectsRef} className="pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Featured Projects */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={projectsInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="mb-16"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Featured Projects</h2>
            <div className="grid lg:grid-cols-2 gap-8">
              {projects.filter(p => p.featured).map((project, index) => (
                <motion.div
                  key={project.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={projectsInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="group bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:scale-105 hover:-translate-y-3"
                >
                  <div className="relative h-48 bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center overflow-hidden">
                    {/* Floating tech icons */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                      {project.technologies.slice(0, 4).map((tech, i) => (
                        <div
                          key={tech}
                          className="absolute bg-white/20 backdrop-blur-sm rounded-lg px-2 py-1 text-xs text-white font-medium border border-white/30"
                          style={{
                            left: `${15 + i * 20}%`,
                            top: `${20 + (i % 2) * 60}%`,
                            transform: 'translateY(20px)',
                            opacity: 0,
                            animation: `floatIn 0.6s ease-out ${i * 0.1}s forwards`
                          }}
                        >
                          {tech}
                        </div>
                      ))}
                    </div>
                    
                    {/* Main icon */}
                    <div className="relative z-10">
                      <project.icon className="w-16 h-16 text-white" />
                    </div>
                    
                    {/* Category badge */}
                    <div className="absolute top-4 right-4">
                      <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm font-medium border border-white/30">
                        {project.category}
                      </span>
                    </div>
                  </div>
                  
                  {/* Pop-out preview image */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-500 pointer-events-none z-50">
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-48 bg-white rounded-xl shadow-2xl overflow-hidden border-4 border-white">
                      <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                        <div className="text-center">
                          <project.icon className="w-16 h-16 text-primary-600 mx-auto mb-4" />
                          <h4 className="text-lg font-bold text-gray-800 mb-2">{project.title}</h4>
                          <p className="text-sm text-gray-600 px-4">{project.description.substring(0, 100)}...</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">{project.title}</h3>
                    <p className="text-gray-600 mb-4 leading-relaxed">{project.description}</p>
                    <div className="flex flex-wrap gap-2 mb-6">
                      {project.technologies.map((tech) => (
                        <span
                          key={tech}
                          className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-medium"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                    <div className="flex gap-4">
                      <a
                        href={project.github}
                        className="inline-flex items-center px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors duration-200"
                      >
                        <Github className="w-4 h-4 mr-2" />
                        Code
                      </a>
                      <a
                        href={project.live}
                        className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                      >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Live Demo
                      </a>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* All Projects */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={projectsInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-8">All Projects</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {projects.map((project, index) => (
                <motion.div
                  key={project.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={projectsInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="group bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:scale-105 hover:-translate-y-2"
                >
                  <div className="relative h-40 bg-gradient-to-br from-primary-400 to-purple-500 flex items-center justify-center overflow-hidden">
                    {/* Floating tech icons */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                      {project.technologies.slice(0, 3).map((tech, i) => (
                        <div
                          key={tech}
                          className="absolute bg-white/20 backdrop-blur-sm rounded-lg px-2 py-1 text-xs text-white font-medium border border-white/30"
                          style={{
                            left: `${20 + i * 25}%`,
                            top: `${25 + (i % 2) * 50}%`,
                            transform: 'translateY(15px)',
                            opacity: 0,
                            animation: `floatIn 0.5s ease-out ${i * 0.1}s forwards`
                          }}
                        >
                          {tech}
                        </div>
                      ))}
                    </div>
                    
                    {/* Main icon */}
                    <div className="relative z-10">
                      <project.icon className="w-12 h-12 text-white" />
                    </div>
                    
                    {/* Category badge */}
                    <div className="absolute top-3 right-3">
                      <span className="px-2 py-1 bg-white/20 backdrop-blur-sm rounded-full text-white text-xs font-medium border border-white/30">
                        {project.category}
                      </span>
                    </div>
                  </div>
                  
                  {/* Pop-out preview image */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-500 pointer-events-none z-50">
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-40 bg-white rounded-lg shadow-2xl overflow-hidden border-4 border-white">
                      <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                        <div className="text-center">
                          <project.icon className="w-12 h-12 text-primary-600 mx-auto mb-3" />
                          <h4 className="text-base font-bold text-gray-800 mb-2">{project.title}</h4>
                          <p className="text-xs text-gray-600 px-3">{project.description.substring(0, 80)}...</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{project.title}</h3>
                    <p className="text-gray-600 mb-4 text-sm leading-relaxed">{project.description}</p>
                    <div className="flex flex-wrap gap-1 mb-4">
                      {project.technologies.slice(0, 3).map((tech) => (
                        <span
                          key={tech}
                          className="px-2 py-1 bg-primary-50 text-primary-600 rounded text-xs font-medium"
                        >
                          {tech}
                        </span>
                      ))}
                      {project.technologies.length > 3 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs font-medium">
                          +{project.technologies.length - 3} more
                        </span>
                      )}
                    </div>
                    <div className="flex gap-3">
                      <a
                        href={project.github}
                        className="inline-flex items-center px-3 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors duration-200 text-sm"
                      >
                        <Github className="w-4 h-4 mr-1" />
                        Code
                      </a>
                      <a
                        href={project.live}
                        className="inline-flex items-center px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200 text-sm"
                      >
                        <ExternalLink className="w-4 h-4 mr-1" />
                        Demo
                      </a>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-purple-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl font-bold text-white mb-4">
              Interested in Working Together?
            </h2>
            <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
              Let's discuss how we can collaborate on your next security project or research initiative.
            </p>
            <a
              href="/contact"
              className="inline-flex items-center px-8 py-4 bg-white text-primary-600 font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              Get In Touch
              <ExternalLink className="ml-2 w-5 h-5" />
            </a>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
