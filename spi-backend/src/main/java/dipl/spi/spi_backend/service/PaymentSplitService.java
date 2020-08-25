package dipl.spi.spi_backend.service;

import dipl.spi.spi_backend.dto.PaymentSplitDto;
import dipl.spi.spi_backend.exception.ApiBadRequestException;
import dipl.spi.spi_backend.model.AppUser;
import dipl.spi.spi_backend.model.Article;
import dipl.spi.spi_backend.model.PaymentSplit;
import dipl.spi.spi_backend.repository.PaymentSplitRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class PaymentSplitService {

    @Autowired
    private PaymentSplitRepository paymentSplitRepository;

    @Autowired
    private ArticleService articleService;

    @Autowired
    private AppUserService appUserService;


    public List<PaymentSplitDto> getPaymentSplitsForArticle(Long articleId) {
        return paymentSplitRepository
                .findByArticleId(articleId)
                .stream()
                .map(PaymentSplitDto::new)
                .collect(Collectors.toList());
    }

    public PaymentSplitDto createPaymentSplit(PaymentSplitDto paymentSplitDto) {

        if(paymentSplitRepository
                .findByArticleIdAndAccountNumber(
                        paymentSplitDto.getArticleId(),
                        paymentSplitDto.getAccount().getNumber()
                )
                .isPresent()
        ) {
            throw new ApiBadRequestException("Payment split with account number "
                    + paymentSplitDto.getAccount().getNumber() + " has already been added to the article");
        }

        Article article = articleService.findById(paymentSplitDto.getArticleId());
        AppUser user = appUserService.findUserById(article.getUser().getId());
        PaymentSplit paymentSplit = new PaymentSplit(paymentSplitDto, user, article);

        return new PaymentSplitDto(paymentSplitRepository.save(paymentSplit));

    }
}