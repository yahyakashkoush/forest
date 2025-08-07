'use client'

import { motion } from 'framer-motion'

const AboutPage = () => {
  return (
    <div className="min-h-screen pt-20">
      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-forest-darkGreen to-forest-black opacity-80"></div>
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <h1 className="font-forest text-5xl md:text-7xl font-bold text-white mb-6">
              Our Story
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 leading-relaxed">
              Born from the whispers of ancient trees and the shadows of forgotten paths
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Story */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 1 }}
              viewport={{ once: true }}
            >
              <h2 className="font-forest text-4xl font-bold text-white mb-6">
                Lost in the Woods
              </h2>
              <div className="space-y-6 text-gray-300 leading-relaxed">
                <p>
                  In the depths of an abandoned forest, where sunlight barely penetrates the canopy 
                  and ancient secrets lie buried beneath fallen leaves, Forest was born. Our founder 
                  discovered this mystical place during a solitary journey, seeking solace from the 
                  chaos of modern life.
                </p>
                <p>
                  The forest spoke in whispers—of resilience, of beauty found in darkness, of the 
                  elegance that emerges when nature reclaims what was once lost. These whispers 
                  became our inspiration, our guiding philosophy, and ultimately, our brand.
                </p>
                <p>
                  Every piece in our collection tells a story of this mysterious woodland. We craft 
                  fashion that embodies the spirit of the wild, the allure of the unknown, and the 
                  sophisticated beauty that thrives in shadows.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 1 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="relative h-96 bg-gradient-to-br from-forest-brown via-forest-darkGreen to-forest-black rounded-lg overflow-hidden">
                <div className="absolute inset-0 bg-dark-texture opacity-30"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-gray-400">
                    <svg className="w-20 h-20 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p>Forest Atmosphere</p>
                  </div>
                </div>
                {/* Animated elements */}
                <div className="absolute top-4 left-4 w-2 h-2 bg-forest-accent rounded-full animate-pulse"></div>
                <div className="absolute bottom-8 right-8 w-3 h-3 bg-forest-accent rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
                <div className="absolute top-1/2 left-8 w-1 h-1 bg-forest-accent rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 px-4 bg-forest-darkGreen bg-opacity-20">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-forest text-4xl md:text-5xl font-bold text-white mb-6">
              Our Values
            </h2>
            <p className="text-gray-400 text-lg max-w-3xl mx-auto">
              Rooted in the wisdom of the forest, our values guide every decision we make
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Mysterious Elegance",
                description: "We believe true beauty lies in the shadows, in the subtle details that whisper rather than shout.",
                icon: "🌙"
              },
              {
                title: "Sustainable Craft",
                description: "Like the forest that regenerates itself, we create fashion that respects and preserves our environment.",
                icon: "🌿"
              },
              {
                title: "Authentic Expression",
                description: "Each piece allows you to express your inner wildness, your connection to the untamed and mysterious.",
                icon: "🦋"
              }
            ].map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="forest-card p-8 text-center"
              >
                <div className="text-4xl mb-4">{value.icon}</div>
                <h3 className="font-forest text-xl font-semibold text-white mb-4">
                  {value.title}
                </h3>
                <p className="text-gray-300 leading-relaxed">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-forest text-4xl md:text-5xl font-bold text-white mb-6">
              The Guardians
            </h2>
            <p className="text-gray-400 text-lg max-w-3xl mx-auto">
              Meet the souls who protect and nurture the Forest vision
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                name: "Elena Shadowmere",
                role: "Founder & Creative Director",
                description: "The visionary who first heard the forest's call and translated its whispers into wearable art."
              },
              {
                name: "Marcus Thornfield",
                role: "Head of Design",
                description: "Master craftsman who shapes raw inspiration into elegant pieces that capture the essence of darkness."
              },
              {
                name: "Luna Nightshade",
                role: "Sustainability Director",
                description: "Guardian of our environmental values, ensuring every creation honors the natural world."
              }
            ].map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="forest-card p-6 text-center"
              >
                <div className="relative w-32 h-32 mx-auto mb-6 bg-gradient-to-b from-forest-gray to-forest-darkGreen rounded-full overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                </div>
                <h3 className="font-forest text-xl font-semibold text-white mb-2">
                  {member.name}
                </h3>
                <p className="text-forest-accent font-medium mb-4">
                  {member.role}
                </p>
                <p className="text-gray-300 text-sm leading-relaxed">
                  {member.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Statement */}
      <section className="py-20 px-4 bg-forest-brown bg-opacity-20">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="font-forest text-4xl md:text-5xl font-bold text-white mb-8">
              Our Mission
            </h2>
            <blockquote className="text-xl md:text-2xl text-gray-300 leading-relaxed italic mb-8">
              "To create fashion that honors the mysterious beauty of the natural world, 
              empowering individuals to embrace their wild, authentic selves while 
              treading lightly upon the earth."
            </blockquote>
            <div className="w-24 h-1 bg-forest-accent mx-auto"></div>
          </motion.div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="font-forest text-4xl font-bold text-white mb-6">
              Join Our Journey
            </h2>
            <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
              Step into the shadows with us. Discover fashion that speaks to your soul 
              and connects you to the ancient wisdom of the forest.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="/shop" className="forest-btn">
                Explore Collection
              </a>
              <a href="/contact" className="forest-btn bg-transparent border-2 border-forest-accent text-forest-accent hover:bg-forest-accent hover:text-forest-black">
                Get in Touch
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default AboutPage