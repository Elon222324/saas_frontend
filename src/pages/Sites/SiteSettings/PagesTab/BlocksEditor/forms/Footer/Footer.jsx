import { Facebook, Instagram, Youtube, Twitter, Phone, Mail } from 'lucide-react'
import { SiVk, SiTelegram } from 'react-icons/si'

export const Footer = ({ settings = {}, commonSettings = {}, data = {} }) => {
  const isCustom = settings?.custom_appearance === true

  const source = isCustom
    ? settings
    : {
        background_color: commonSettings.background?.muted,
        text_color: commonSettings.text?.primary,
        border_color: commonSettings.background?.surface,
        font_family: commonSettings.typography?.font_family,
        font_size_base: 14,
        transition_duration: `${commonSettings.transition?.duration || 0.3}s`,
        icon_color: commonSettings.icon?.default,
        icon_color_hover: commonSettings.icon?.hover,
        alignment: 'spread',
        section_spacing_top: 48,
        section_spacing_bottom: 24,
        show_sections: {
          about: true,
          contacts: true,
          socials: true,
        },
        show_social_icons: {
          facebook: true,
          instagram: true,
          vk: true,
          youtube: true,
          telegram: true,
          twitter: true,
        },
        show_payment_icons: false,
      }

  const {
    background_color = '#FFFFFF',
    text_color = '#212121',
    border_color = 'rgba(0,0,0,0.1)',
    font_family = 'inherit',
    font_size_base = 14,
    transition_duration = '0.3s',
    icon_color = '#6B7280',
    icon_color_hover = '#374151',
    alignment = 'spread',
    section_spacing_top = 48,
    section_spacing_bottom = 24,
    show_sections = { about: true, contacts: true, socials: true },
    show_social_icons = {
      facebook: true,
      instagram: true,
      vk: true,
      youtube: true,
      telegram: true,
      twitter: true,
    },
  } = source

  const alignmentClass = {
    left: 'items-start text-left',
    center: 'items-center text-center',
    spread: 'md:items-start md:text-left text-center md:text-left',
  }[alignment] || 'md:items-start text-left'

  const socialIcons = [
    { key: 'facebook', Icon: Facebook, href: data.facebook_link || '#' },
    { key: 'instagram', Icon: Instagram, href: data.instagram_link || '#' },
    { key: 'vk', Icon: SiVk, href: data.vk_link || '#' },
    { key: 'youtube', Icon: Youtube, href: data.youtube_link || '#' },
    { key: 'telegram', Icon: SiTelegram, href: data.telegram_link || '#' },
    { key: 'twitter', Icon: Twitter, href: data.twitter_link || '#' },
  ]

  const aboutText =
    data.about_text ||
    'Мы доставляем горячую пиццу с любовью. Работаем с 10:00 до 23:00 каждый день.'
  const phoneNumber = data.phone_number || '+84 123 456 789'
  const emailAddress = data.email_address || 'support@pizzadelivery.vn'
  const copyrightText =
    data.copyright_text || 'PizzaDelivery. Все права защищены.'

  return (
    <footer
      className="w-full"
      style={{
        backgroundColor: background_color,
        color: text_color,
        fontFamily: font_family,
        fontSize: `${font_size_base}px`,
        transition: `all ${transition_duration}`,
        paddingTop: `${section_spacing_top}px`,
        paddingBottom: `${section_spacing_bottom}px`,
      }}
    >
      <div className={`w-full px-4 sm:px-6 lg:px-12`}>
        <div className={`max-w-screen-xl mx-auto grid gap-8 md:grid-cols-3 ${alignmentClass}`}>
          {show_sections.about && (
            <div>
              <h4 className="text-base font-semibold mb-2">О компании</h4>
              <p style={{ opacity: 0.8 }}>{aboutText}</p>
            </div>
          )}

          {show_sections.contacts && (
            <div>
              <h4 className="text-base font-semibold mb-2">Контакты</h4>
              <ul style={{ opacity: 0.8 }} className="space-y-1">
                <li className="flex items-center justify-center md:justify-start gap-2">
                  <Phone className="w-4 h-4" style={{ color: icon_color }} /> {phoneNumber}
                </li>
                <li className="flex items-center justify-center md:justify-start gap-2">
                  <Mail className="w-4 h-4" style={{ color: icon_color }} /> {emailAddress}
                </li>
              </ul>
            </div>
          )}

          {show_sections.socials && (
            <div>
              <h4 className="text-base font-semibold mb-2">Мы в соцсетях</h4>
              <div className="flex justify-center md:justify-start gap-4" style={{ opacity: 0.8 }}>
                {socialIcons
                  .filter(({ key }) => show_social_icons?.[key])
                  .map(({ key, Icon, href }) => (
                    <a
                      key={key}
                      href={href}
                      className="hover:opacity-100 transition-opacity"
                      style={{ color: icon_color }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = icon_color_hover)}
                      onMouseLeave={(e) => (e.currentTarget.style.color = icon_color)}
                    >
                      <Icon className="w-5 h-5" />
                    </a>
                  ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div
        className="text-center text-xs py-4 border-t mt-8"
        style={{
          opacity: 0.7,
          borderColor: border_color,
          borderTopWidth: 1,
          borderStyle: 'solid',
        }}
      >
        © {new Date().getFullYear()} {copyrightText}
      </div>
    </footer>
  )
}

export default Footer
