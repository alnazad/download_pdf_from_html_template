if (this.pdfDeatilsService) {
          setTimeout(() => {
            this.pdfDeatilsService.generatePdf(this.shinseiId);
          }, 0);
        } else {
          console.error("pdfDetailsService is not available.");
        }
