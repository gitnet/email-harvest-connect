import React from 'react'

export default function footer() {
  return (
    <div>
       {/* Footer */}
      <footer className="bg-background border-t border-border/50 py-12">
        <div className="container mx-auto px-6 text-center">
          <p className="text-muted-foreground">
            Built with React and powered by Devismail - Email Harvest Tool
            <br />
            <b>Support us</b>
          </p>
          <p className='text-muted-foreground'>
            <img src="../../public/images/bmc_qr.png" alt="Devismail Logo" className="h-20 inline-block" />
          </p>
        </div>
      </footer>
    </div>
  )
}
